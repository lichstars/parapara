const aws = require('aws-sdk');
const config = require('./config');
const nodemailer = require('nodemailer')

const aws_table_name = 'stories';
const env_email_user = process.env.EMAIL_USER
const env_email_password = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: env_email_user, pass: env_email_password }
});

module.exports = {
  getAll: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const params = { TableName: aws_table_name };
    db.scan(params, function(err, data) {
      if (err) { res.json(err); return; }
      const { Items } = data
      res.json(Items);
    });
  },
  get: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const params = {
      TableName: aws_table_name,
      Key:{ "id": req.query.id },
    };
    db.get(params, function(err, data) {
      if (err) { res.json(err); return; }
      const { Item } = data
      res.json(Item);
    });
  },
  insert: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const story = req.body
    const params = {
      TableName: aws_table_name,
      Item: { ...story }
    };
    db.put(params, function(err, data) {
      if (err) { res.json(err); return; }
      res.json(story);
    });
  },
  update: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const story = req.body
    const params = {
      TableName: aws_table_name,
      Key:{ "id": story.id },
      UpdateExpression: "set title = :title, updated_by=:updated_by, updated_at=:updated_at, #p=list_append(#p, :para)",
      ExpressionAttributeNames: { "#p": "paras" },
      ExpressionAttributeValues:{
          ":title": story.title,
          ":updated_by": story.updated_by,
          ":updated_at": story.updated_at,
          ":para": [{ ...story.para }],
      },
      ReturnValues: "UPDATED_NEW"
    };
    db.update(params, function(err, data) {
      if (err) { res.json(err); return; }
      res.json(story);
    });
  },
  notify: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const params = {
      TableName: aws_table_name,
      ExpressionAttributeValues: { ":story_id": req.body.id },
      ProjectionExpression: 'paras, title',
      KeyConditionExpression: "id = :story_id",
    };
    db.query(params, function(err, data) {
      if (err) { res.json(err); return; }
      const { Items } = data
      const paras = Items[0].paras
      const allEmails = []
      paras.forEach(para => {
        if (para.created_by.email !== req.body.email) {
          allEmails.push(para.created_by.email)
        }
      })
      const emails = [... new Set(allEmails)]
      emails.forEach(recipient => {
        const mailOptions = {
          from: env_email_user,
          to: recipient,
          subject: `parapara: ${Items[0].title}`,
          html: `${req.body.fromGivenName} just wrote something to your story. <br />
          Read <a href="${req.body.pageUrl}">${Items[0].title} here.</a>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) { res.json(err) }
          res.json("email sent")
        });
      });
    });
  },
}
