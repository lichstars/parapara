import React from 'react';
import styled from 'styled-components';
import { media } from '../utils/media';

const AuthorRow = styled.div`
  margin: -2px;
  max-width: 140px;
  ${media.small`padding: 0 16px;`}
`;
const Image = styled.img`height: 25px;padding: 2px;`;

const AuthorImages = ({ props }) => {
  const uniqueImages = () => {
    const images = props.story.paras.map(para => para.created_by.imageUrl)
    return [ ...new Set(images) ]
  }

  return (
    <AuthorRow>
      { props.story.paras &&
        uniqueImages().map((imageUrl, index) => <Image key={ index } src= { imageUrl } alt="authors" /> ) }
    </AuthorRow>
  )
}

export default AuthorImages;
