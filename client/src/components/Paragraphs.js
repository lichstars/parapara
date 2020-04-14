import React from 'react';
import styled from 'styled-components';
import moment from 'moment'
import colors from '../utils/colors'

const Paragraph = styled.div`padding: 15px 0;margin: 15px 0;font-weight: 600;color: ${colors.WHITE};`;
const Timestamp = styled.span`color: ${colors.TIMESTAMP};margin-right: 4px;`;
const Author = styled.span`color: ${colors.BRIGHTBLUE};`;
const Text = styled.div`color: ${colors.GREY}`;

const Paragraphs = ({ props }) => {
  return (
    <div>
      {
        props.story && props.story.paras &&
        props.story.paras.map((para, index) =>
          <Paragraph key={ index }>
            <Timestamp>{ moment(para.created_at).format('YYYY-MM-DD HH:mm:ss') }</Timestamp>
            (<Author>{ para.created_by.givenName.toLowerCase() }</Author>):
            <Text>{ para.text }</Text>
          </Paragraph>
        )
      }
    </div>
  )
}

export default Paragraphs;
