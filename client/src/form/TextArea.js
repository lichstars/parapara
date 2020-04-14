import React from 'react';
import FormControl from 'react-bootstrap/FormControl'
import styled from 'styled-components';
import colors from '../utils/colors'

const StyledFormControl = styled(FormControl)`
  display: block;
  width: 100%;
  padding: 0px 4px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${colors.WHITE};
  background-color: ${colors.BACKGROUND};
  background-clip: padding-box;
  border: none;
  border-radius: .25rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  :focus {
    outline-color: none;
    outline: none;
  }
`;
const Prefix = styled.div`font-weight:600;color:${colors.HOTPINK}`;
const Section = styled.div`display: flex; flex-direction:row;align-items:top;`;

const TextArea = (props) => {
  const { input, placeholder, rows } = props;
  return (
    <Section>
      <Prefix>></Prefix>
      <StyledFormControl
        { ...input }
        type='textarea'
        placeholder={ placeholder }
        value={ input.value }
        rows={ rows }
        as="textarea"
      />
    </Section>
  );
};

export default TextArea;
