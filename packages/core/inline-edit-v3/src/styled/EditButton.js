// @flow
import styled from 'styled-components';

const EditButton = styled.button`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background: grey;
  border: 0;
  display: inline-block;
  line-height: 1;
  margin: 0;
  padding: 0;
  opacity: ${props => (props.onHover ? '1' : '0')};
  outline: 0;
`;

EditButton.displayName = 'EditButton';

export default EditButton;
