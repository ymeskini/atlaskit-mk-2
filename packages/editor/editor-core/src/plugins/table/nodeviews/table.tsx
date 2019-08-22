import * as React from 'react';
import {
  Node as PmNode,
  DOMOutputSpec,
  DOMSerializer,
} from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import ReactNodeView, {
  ForwardRef,
  getPosHandler,
} from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { generateColgroup } from '../pm-plugins/table-resizing/utils';
import TableComponent from './TableComponent';

import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { pluginKey, getPluginState } from '../pm-plugins/main';
import { pluginKey as tableResizingPluginKey } from '../pm-plugins/table-resizing/index';
import { contentWidth } from '../pm-plugins/table-resizing/utils';
import { handleBreakoutContent } from '../pm-plugins/table-resizing/commands';
import { pluginConfig as getPluginConfig } from '../index';
import { TableCssClassName as ClassName } from '../types';
import { closestElement } from '../../../utils';

export type TableOptions = {
  dynamicTextSizing?: boolean;
  isBreakoutEnabled?: boolean;
  isFullWidthModeEnabled?: boolean;
  wasFullWidthModeEnabled?: boolean;
};

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing?: boolean;
  cellMinWidth?: number;
  portalProviderAPI: PortalProviderAPI;
  getPos: () => number;
  options?: TableOptions;
}

const tableAttributes = (node: PmNode) => {
  return {
    'data-number-column': node.attrs.isNumberColumnEnabled,
    'data-layout': node.attrs.layout,
    'data-autosize': node.attrs.__autoSize,
  };
};

const toDOM = (node: PmNode, props: Props) => {
  let colgroup: DOMOutputSpec = '';

  if (props.allowColumnResizing) {
    // @ts-ignore
    colgroup = ['colgroup', {}].concat(generateColgroup(node));
  }

  return [
    'table',
    tableAttributes(node),
    colgroup,
    ['tbody', 0],
  ] as DOMOutputSpec;
};

export default class TableView extends ReactNodeView {
  private table: HTMLElement | undefined;
  private observer?: MutationObserver;

  constructor(props: Props) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI, props);

    const MutObserver = (window as any).MutationObserver;
    this.observer = MutObserver && new MutObserver(this.handleMutation);
  }

  getContentDOM() {
    const rendered = DOMSerializer.renderSpec(
      document,
      toDOM(this.node, this.reactComponentProps as Props),
    );

    if (rendered.dom) {
      this.table = rendered.dom as HTMLElement;

      // Ignore mutation doesn't pick up children updates
      // E.g. inserting a bodiless extension that renders
      // arbitrary nodes (aka macros).
      requestAnimationFrame(() => {
        if (this.observer) {
          this.observer.observe(rendered.dom, {
            subtree: true,
            childList: true,
            attributes: true,
          });
        }
      });
    }

    return rendered;
  }

  setDomAttrs(node: PmNode) {
    if (!this.table) {
      return;
    }

    const attrs = tableAttributes(node);
    (Object.keys(attrs) as Array<keyof typeof attrs>).forEach(attr => {
      this.table!.setAttribute(attr, attrs[attr]);
    });
  }

  render(props: Props, forwardRef: ForwardRef) {
    return (
      <WithPluginState
        plugins={{
          containerWidth: widthPluginKey,
          pluginState: pluginKey,
          tableResizingPluginState: tableResizingPluginKey,
        }}
        editorView={props.view}
        render={pluginStates => (
          <TableComponent
            {...props}
            {...pluginStates}
            node={this.node}
            width={pluginStates.containerWidth.width}
            contentDOM={forwardRef}
          />
        )}
      />
    );
  }

  ignoreMutation() {
    return true;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    super.destroy();
  }

  private resizeForBreakoutContent = (target: HTMLElement) => {
    const { view } = this;
    const elemOrWrapper = closestElement(
      target,
      `.${ClassName.TABLE_HEADER_CELL}, .${ClassName.TABLE_CELL}`,
    );
    const { minWidth } = contentWidth(target, target);

    // This can also trigger for a non-resized table.
    if (this.node && elemOrWrapper && elemOrWrapper.offsetWidth < minWidth) {
      const cellPos = view.posAtDOM(elemOrWrapper, 0);
      const domAtPos = view.domAtPos.bind(view);
      const { state, dispatch } = view;
      handleBreakoutContent(
        elemOrWrapper as HTMLTableElement,
        cellPos - 1,
        this.getPos() + 1,
        minWidth,
        this.node,
        domAtPos,
      )(state, dispatch);
    }
  };

  private resizeForExtensionContent = (target: HTMLElement) => {
    if (!this.node) {
      return;
    }
    const { view } = this;
    const elemOrWrapper = closestElement(
      target,
      '.inlineExtensionView-content-wrap, .extensionView-content-wrap',
    );
    if (!elemOrWrapper) {
      return;
    }
    const container = closestElement(
      target,
      `.${ClassName.TABLE_HEADER_CELL}, .${ClassName.TABLE_CELL}`,
    ) as HTMLTableElement;
    if (!container) {
      return;
    }

    if (container.offsetWidth < elemOrWrapper.offsetWidth) {
      const domAtPos = view.domAtPos.bind(view);
      const cellPos = view.posAtDOM(container, 0);
      const { state, dispatch } = view;
      handleBreakoutContent(
        container,
        cellPos - 1,
        this.getPos() + 1,
        elemOrWrapper.offsetWidth,
        this.node,
        domAtPos,
      )(state, dispatch);
    }
  };

  private handleMutation = (records: Array<MutationRecord>) => {
    if (!records.length || !this.contentDOM) {
      return;
    }

    const uniqueTargets: Set<HTMLElement> = new Set();
    records.forEach(record => {
      const target = record.target as HTMLElement;
      // ED-7344: ignore mutations that happen inside anything other than DIV or SPAN elements
      if (
        ['DIV', 'SPAN'].indexOf(target.tagName) === -1 ||
        target.classList.contains(ClassName.RESIZE_HANDLE)
      ) {
        return;
      }
      // If we've seen this target already in this set of targets
      // We dont need to reprocess.
      if (!uniqueTargets.has(target)) {
        this.resizeForBreakoutContent(target);
        this.resizeForExtensionContent(target);
        uniqueTargets.add(target);
      }
    });
  };
}

export const createTableView = (
  node: PmNode,
  view: EditorView,
  getPos: getPosHandler,
  portalProviderAPI: PortalProviderAPI,
  options: TableOptions,
): NodeView => {
  const { pluginConfig } = getPluginState(view.state);
  const { allowColumnResizing } = getPluginConfig(pluginConfig);
  return new TableView({
    node,
    view,
    allowColumnResizing,
    portalProviderAPI,
    getPos,
    options,
  }).init();
};
