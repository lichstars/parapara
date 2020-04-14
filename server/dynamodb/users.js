const aws = require('aws-sdk');
const config = require('./config');
const aws_table_name = 'users';

module.exports = {
  insert: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const user = req.body
    const params = {
      TableName: aws_table_name,
      Key:{ "email": user.email },
    };
    db.get(params, function(err, data) {
      if (err) { res.json(err); return; }
      const { Item } = data
      if (Item != undefined) { res.json(Item); return; }
      const params = {
        TableName: aws_table_name,
        Item: { ...user }
      };
      db.put(params, function(err, data) {
        if (err) { res.json(err); return; }
        res.json({ ...user });
      });
    });
  },
  linkStory: (req, res) => {
    aws.config.update(config.aws_config);
    const db = new aws.DynamoDB.DocumentClient();
    const params = {
      TableName: aws_table_name,
      Key:{ "email": req.body.email },
    };
    db.get(params, function(err, data) {
      if (err) { console.log(err); return; }
      const { Item } = data
      if (Item.stories === undefined) {
        Item.stories = []
      }
      let linkedStories = Array.from(Item.stories)
      const index = linkedStories.findIndex(item => item.id === req.body.story_id)
      if (index === -1) {
        Item.stories.push({
          id: req.body.story_id,
          cursor: req.body.cursor,
        })
        const params = {
          TableName: aws_table_name,
          Key:{ "email": req.body.email },
          UpdateExpression: "set stories=:stories",
          ExpressionAttributeValues: {
            ":stories": Item.stories,
          },
          ReturnValues: "UPDATED_NEW"
        };
        db.update(params, function(err, data) {
          if (err) { res.json(err); return; }
          res.json(Item.stories);
        });
      } else {
        let existingItem = Object.assign({}, linkedStories[index])
        existingItem.cursor = req.body.cursor
        linkedStories[index] = existingItem
        const params = {
          TableName: aws_table_name,
          Key:{ "email": req.body.email },
          UpdateExpression: "set stories=:stories",
          ExpressionAttributeValues: {
            ":stories": linkedStories,
          },
          ReturnValues: "UPDATED_NEW"
        };
        db.update(params, function(err, data) {
          if (err) { res.json(err); return; }
          res.json(linkedStories);
        });
      }
    });
  },
}
