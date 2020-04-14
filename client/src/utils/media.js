import { css } from 'styled-components';

export const sizes = {
  large: 1140,
  medium: 801,
  small: 576,
};

export const media = Object.keys(sizes).reduce((accumulator, label) => {

  accumulator[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;
  return accumulator;
}, {});

export default media;
