import { Node as PmNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { TableLayout } from '@atlaskit/adf-schema';
import { TableSharedCssClassName } from '@atlaskit/editor-common';

export type PermittedLayoutsDescriptor = TableLayout[] | 'all';
export type Cell = { pos: number; start: number; node: PmNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export interface PluginConfig {
  advanced?: boolean;
  allowBackgroundColor?: boolean;
  allowColumnResizing?: boolean;
  allowHeaderColumn?: boolean;
  allowHeaderRow?: boolean;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  isHeaderRowRequired?: boolean;
  stickToolbarToBottom?: boolean;
  permittedLayouts?: PermittedLayoutsDescriptor;
  allowControls?: boolean;
}

export interface ColumnResizingPluginState {
  resizeHandlePos: number | null;
  dragging: { startX: number; startWidth: number } | null;
  lastClick: { x: number; y: number; time: number } | null;
  lastColumnResizable?: boolean;
  dynamicTextSizing?: boolean;
}

export interface TablePluginState {
  decorationSet: DecorationSet;
  editorHasFocus?: boolean;
  hoveredColumns: number[];
  hoveredRows: number[];
  pluginConfig: PluginConfig;
  isHeaderColumnEnabled: boolean;
  isHeaderRowEnabled: boolean;
  // position of a cell PM node that has cursor
  targetCellPosition?: number;
  // controls need to be re-rendered when table content changes
  // e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
  tableNode?: PmNode;
  tableRef?: HTMLElement;
  tableWrapperTarget?: HTMLElement;
  isContextualMenuOpen?: boolean;
  isInDanger?: boolean;
  insertColumnButtonIndex?: number;
  insertRowButtonIndex?: number;
  isFullWidthModeEnabled?: boolean;
}

export type TablePluginAction =
  | { type: 'SET_EDITOR_FOCUS'; data: { editorHasFocus: boolean } }
  | { type: 'TOGGLE_HEADER_ROW' }
  | { type: 'TOGGLE_HEADER_COLUMN' }
  | {
      type: 'SET_TABLE_REF';
      data: {
        tableRef?: HTMLElement;
        tableNode?: PmNode;
        tableWrapperTarget?: HTMLElement;
      };
    }
  | {
      type: 'HOVER_ROWS';
      data: {
        decorationSet: DecorationSet;
        hoveredRows: number[];
        isInDanger?: boolean;
      };
    }
  | {
      type: 'HOVER_COLUMNS';
      data: {
        decorationSet: DecorationSet;
        hoveredColumns: number[];
        isInDanger?: boolean;
      };
    }
  | {
      type: 'HOVER_TABLE';
      data: {
        decorationSet: DecorationSet;
        hoveredRows: number[];
        hoveredColumns: number[];
        isInDanger?: boolean;
      };
    }
  | { type: 'CLEAR_HOVER_SELECTION'; data: { decorationSet: DecorationSet } }
  | { type: 'SET_TARGET_CELL_POSITION'; data: { targetCellPosition?: number } }
  | { type: 'SHOW_INSERT_ROW_BUTTON'; data: { insertRowButtonIndex: number } }
  | {
      type: 'SHOW_INSERT_COLUMN_BUTTON';
      data: { insertColumnButtonIndex: number };
    }
  | {
      type: 'HIDE_INSERT_COLUMN_OR_ROW_BUTTON';
    }
  | { type: 'TOGGLE_CONTEXTUAL_MENU' };

export type ColumnResizingPluginAction =
  | {
      type: 'SET_RESIZE_HANDLE_POSITION';
      data: { resizeHandlePos: number | null };
    }
  | {
      type: 'SET_DRAGGING';
      data: { dragging: { startX: number; startWidth: number } | null };
    }
  | {
      type: 'SET_LAST_CLICK';
      data: { lastClick: { x: number; y: number; time: number } | null };
    };

export const TableDecorations = {
  CONTROLS_HOVER: 'CONTROLS_HOVER',
};
const clPrefix = 'pm-table-';

export const TableCssClassName = {
  ...TableSharedCssClassName,

  COLUMN_CONTROLS_WRAPPER: `${clPrefix}column-controls-wrapper`,
  COLUMN_CONTROLS: `${clPrefix}column-controls`,
  COLUMN_CONTROLS_INNER: `${clPrefix}column-controls__inner`,
  COLUMN_CONTROLS_BUTTON_WRAP: `${clPrefix}column-controls__button-wrap`,

  ROW_CONTROLS_WRAPPER: `${clPrefix}row-controls-wrapper`,
  ROW_CONTROLS: `${clPrefix}row-controls`,
  ROW_CONTROLS_INNER: `${clPrefix}row-controls__inner`,
  ROW_CONTROLS_BUTTON_WRAP: `${clPrefix}row-controls__button-wrap`,

  CONTROLS_BUTTON: `${clPrefix}controls__button`,
  CONTROLS_BUTTON_ICON: `${clPrefix}controls__button-icon`,

  CONTROLS_INSERT_BUTTON: `${clPrefix}controls__insert-button`,
  CONTROLS_INSERT_BUTTON_INNER: `${clPrefix}controls__insert-button-inner`,
  CONTROLS_INSERT_BUTTON_WRAP: `${clPrefix}controls__insert-button-wrap`,
  CONTROLS_INSERT_LINE: `${clPrefix}controls__insert-line`,
  CONTROLS_BUTTON_OVERLAY: `${clPrefix}controls__button-overlay`,
  LAYOUT_BUTTON: `${clPrefix}layout-button`,

  CONTROLS_INSERT_MARKER: `${clPrefix}controls__insert-marker`,
  CONTROLS_INSERT_COLUMN: `${clPrefix}controls__insert-column`,
  CONTROLS_INSERT_ROW: `${clPrefix}controls__insert-row`,
  CONTROLS_DELETE_BUTTON_WRAP: `${clPrefix}controls__delete-button-wrap`,
  CONTROLS_DELETE_BUTTON: `${clPrefix}controls__delete-button`,

  CORNER_CONTROLS: `${clPrefix}corner-controls`,
  CONTROLS_CORNER_BUTTON: `${clPrefix}corner-button`,

  NUMBERED_COLUMN: `${clPrefix}numbered-column`,
  NUMBERED_COLUMN_BUTTON: `${clPrefix}numbered-column__button`,

  HOVERED_CELL: `${clPrefix}hovered-cell`,
  WITH_CONTROLS: `${clPrefix}with-controls`,
  RESIZING_PLUGIN: `${clPrefix}resizing-plugin`,
  RESIZE_CURSOR: `${clPrefix}resize-cursor`,
  IS_RESIZING: `${clPrefix}is-resizing`,

  CONTEXTUAL_SUBMENU: `${clPrefix}contextual-submenu`,
  CONTEXTUAL_MENU_BUTTON_WRAP: `${clPrefix}contextual-menu-button-wrap`,
  CONTEXTUAL_MENU_BUTTON: `${clPrefix}contextual-menu-button`,
  CONTEXTUAL_MENU_ICON: `${clPrefix}contextual-submenu-icon`,

  CELL_NODEVIEW_WRAPPER: `${clPrefix}cell-nodeview-wrapper`,

  // come from prosemirror-table
  COLUMN_RESIZE_HANDLE: 'column-resize-handle',
  SELECTED_CELL: 'selectedCell',

  // defined in ReactNodeView based on PM node name
  NODEVIEW_WRAPPER: 'tableView-content-wrap',
  TABLE_HEADER_NODE_WRAPPER: 'tableHeaderView-content-wrap',
  TABLE_CELL_NODE_WRAPPER: 'tableCellView-content-wrap',

  TOP_LEFT_CELL: 'table > tbody > tr:nth-child(2) > td:nth-child(1)',
};
