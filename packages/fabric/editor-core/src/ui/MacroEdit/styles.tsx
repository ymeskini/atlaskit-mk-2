import styled from 'styled-components';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { akBorderRadius } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Toolbar = styled.div`
  background: white;
  border-radius: ${akBorderRadius};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 5px;
  display: flex;
  button:first-child > span {
    min-width: 55px;
  }
  * span > span + span {
    padding: 4px 4px 0 0px;
    align-self: center;
    line-height: normal;
  }
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  border-left: 1px solid ${akColorN30};
  width: 1px;
  display: inline-block;
  margin: 0 5px;
`;
