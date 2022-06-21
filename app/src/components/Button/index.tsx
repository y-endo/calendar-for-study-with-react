import styled from 'styled-components';
import { Margin } from '~/utils/style';

/**
 * 汎用ボタン
 * color,size を設定可能。
 * utilsのMarginを継承。
 */
type ButtonProps = {
  color?: 'primary' | 'secondary';
  size?: 'large' | 'small';
};
const Button = Margin.withComponent(styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: filter 0.3s ease-out;

  ${props =>
    props.color === 'primary' &&
    `
      color: #fff;
      border: none;
      background-color: ${props.theme.palette.primary.main};
    `}

  ${props =>
    props.color === 'secondary' &&
    `
      color: #000;
      border: none;
      background-color: ${props.theme.palette.secondary.main};
    `}

  ${props =>
    props.size === 'large' &&
    `
      font-size: 1.8rem;
      padding: 10px 12px;
    `}

  ${props =>
    props.size === 'small' &&
    `
      font-size: 1.4rem;
      padding: 4px 6px;
    `}

  &:disabled {
    color: #666;
    background-color: #eee;
    &:hover {
      filter: brightness(1);
    }
  }

  &:hover {
    filter: brightness(1.1);
  }
`);

export default Button;
