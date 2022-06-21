/**
 * 汎用的なstyled-componentsをまとめたもの
 */

import styled from 'styled-components';

/**
 * margin
 */
export interface IMarginProps {
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
}

export const Margin = styled.div<IMarginProps>`
  margin-top: ${props => props.mt};
  margin-right: ${props => props.mr};
  margin-bottom: ${props => props.mb};
  margin-left: ${props => props.ml};
`;

Margin.defaultProps = {
  mt: '0',
  mr: '0',
  mb: '0',
  ml: '0'
};

/**
 * padding
 */
export interface IPaddingProps {
  pt?: string;
  pr?: string;
  pb?: string;
  pl?: string;
}

export const Padding = styled.div<IPaddingProps>`
  padding-top: ${props => props.pt};
  padding-right: ${props => props.pr};
  padding-bottom: ${props => props.pb};
  padding-left: ${props => props.pl};
`;

Padding.defaultProps = {
  pt: '0',
  pr: '0',
  pb: '0',
  pl: '0'
};
