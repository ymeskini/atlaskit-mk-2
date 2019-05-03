// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
import {
  columnLayoutSharedStyle,
  gridMediumMaxWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorDeleteBorderSize,
} from '@atlaskit/editor-common';

export const LAYOUT_OFFSET = 13;
export const LAYOUT_SECTION_MARGIN = gridSize() - 2;

export const layoutStyles = css`
  .ProseMirror {
    ${columnLayoutSharedStyle} [data-layout-section] {
      position: relative;
      width: calc(100% + ${LAYOUT_OFFSET * 2}px);
      /* left-padding (12px) + layout-column-border (1px) */
      left: -${LAYOUT_OFFSET}px;
      margin-top: ${gridSize() - 1}px;

      /* Inner cursor located 26px from left */
      & > * {
        flex: 1;
        min-width: 0;
        border: 1px solid ${colors.N40};
        border-radius: 5px;

        > div {
          padding: ${gridSize() * 1.5}px;
        }
      }

      & > * + * {
        margin-left: ${LAYOUT_SECTION_MARGIN}px;
      }

      @media screen and (max-width: ${gridMediumMaxWidth}px) {
        & > * + * {
          margin-left: 0;
        }
      }

      /**
        * Border to show when node is selected
        * Helps visualise when 'selectNodeBackwards' selects the node for deletion
        */
      &.ProseMirror-selectednode > * {
        border-color: ${colors.B200};
      }
      /* Shows the border when cursor is inside a layout */
      &.selected > * {
        border-color: ${colors.N50};
      }

      &.selected.danger > [data-layout-column] {
        background-color: ${akEditorDeleteBackground};
        border: ${akEditorDeleteBorderSize}px solid ${akEditorDeleteBorder};
      }
    }
  }
`;
