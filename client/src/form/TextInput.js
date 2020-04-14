import React from 'react';
import FormControl from 'react-bootstrap/FormControl'
import styled from 'styled-components';
import { media } from '../utils/media';
import colors from '../utils/colors'

const StyledFormControl = styled(FormControl)`
  margin-left: -12px;
  margin-right: -12px;
  font-size: 20px;
  ${media.small`
    margin-left: 0;
    margin-right: 0;
    font-size: 2.5rem;
    padding-left: 16px;
  `}
  border: none;
  font-weight: 600;
  color: ${colors.BRIGHTGREEN};
  background: ${colors.BACKGROUND};
  :focus {
    background: ${colors.BACKGROUND};
    outline-color: ${colors.GREY};
    color: ${colors.BRIGHTGREEN};
    border: none;
    box-shadow: none;
  }
  :disabled {
    background: ${colors.BACKGROUND};
  }
`;

const TextInput = (props) => {
  const { input, placeholder, type, disabled } = props;

  return (
      <StyledFormControl
        { ...input }
        type={ type }
        placeholder={ placeholder }
        value={ input.value }
        disabled={ disabled }
      />
  );
};

export default TextInput;
