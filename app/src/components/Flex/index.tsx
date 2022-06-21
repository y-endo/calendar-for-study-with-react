import styled from 'styled-components';
import { Margin } from '~/utils/style';

/**
 * 汎用flex
 * display, justify-content, align-items をpropsで設定できる。
 * これ以上詳細なプロパティを設定したい場合は各コンポーネントで定義すること。
 * utilsのMarginを継承。
 */
type FlexProps = {
  inline?: boolean;
  justifyContent?: 'start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'stretch' | 'center' | 'start' | 'end';
};
const Flex = Margin.withComponent(styled.div<FlexProps>`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : 'start')};
  align-items: ${props => (props.alignItems ? props.alignItems : 'stretch')};
`);

export default Flex;
