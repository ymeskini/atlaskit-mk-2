import { NodeSelection } from 'prosemirror-state';
import {
  createEditorFactory,
  doc,
  p as paragraph,
  date,
  sendKeyToPm,
  insertText,
} from '@atlaskit/editor-test-helpers';

import {
  setDatePickerAt,
  insertDate,
  openDatePicker,
  closeDatePicker,
} from '../../../../plugins/date/actions';
import { pluginKey } from '../../../../plugins/date/plugin';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';
import { INPUT_METHOD } from '../../../../plugins/analytics';
import { EditorView } from 'prosemirror-view';

describe('date plugin', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEventSignature;
  let editorView: EditorView;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    return createEditor({
      doc,
      editorProps: { allowDate: true, allowAnalyticsGASV3: true },
      createAnalyticsEvent,
    });
  };

  const timestamp = '1515639075805';
  const attrs = { timestamp };

  describe('actions', () => {
    describe('setDatePickerAt', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello', date(attrs))),
        );

        const showDatePickerAt = view.state.selection.$from.pos;
        const result = setDatePickerAt(showDatePickerAt)(
          view.state,
          view.dispatch,
        );

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(showDatePickerAt);
        expect(result).toBe(true);
      });
    });

    describe('insertDate', () => {
      it('should insert date node to the document', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate()(view.state, view.dispatch);
        expect(
          view.state.doc.nodeAt(view.state.selection.$from.pos)!.type.name,
        ).toEqual(view.state.schema.nodes.date.name);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(null);
      });

      it('should insert UTC timestamp', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate({ year: 2018, month: 5, day: 1 })(view.state, view.dispatch);
        const node = view.state.doc.nodeAt(view.state.selection.$from.pos);
        expect(node!.type.name).toEqual(view.state.schema.nodes.date.name);
        expect(node!.attrs.timestamp).toEqual(Date.UTC(2018, 4, 1).toString());
      });

      it('should keep the same "showDatePickerAt" in collab mode', () => {
        const { editorView: view } = editor(doc(paragraph('world{<>}')));
        insertDate()(view.state, view.dispatch);
        openDatePicker()(view.state, view.dispatch);

        const documentChangeTr = view.state.tr.insertText('hello ', 1);
        // Don't use dispatch to mimic collab provider
        view.updateState(view.state.apply(documentChangeTr));

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(12);
      });

      it('should fire analytics event', () => {
        const { editorView: view } = editor(doc(paragraph('{<>}')));
        insertDate(undefined, INPUT_METHOD.TOOLBAR)(view.state, view.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'date',
          eventType: 'track',
          attributes: { inputMethod: 'toolbar' },
        });
      });
    });

    describe('openDatePicker', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node and select the node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });

      it('should open date picker on enter when date node is selected', () => {
        const { editorView: view, sel } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        const tr = view.state.tr;
        tr.setSelection(NodeSelection.create(tr.doc, sel));
        view.dispatch(tr);
        sendKeyToPm(view, 'Enter');
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });
    });

    describe('closeDatePicker', () => {
      it('should set "showDatePickerAt" prop to falsy and move selection to after the node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        closeDatePicker()(view.state, view.dispatch);
        const newPluginState = pluginKey.getState(view.state);
        expect(newPluginState.showDatePickerAt).toBeFalsy();
        expect(view.state.selection instanceof NodeSelection).toEqual(false);
        expect(view.state.selection.from).toEqual(7);
      });
    });
  });

  describe('quick insert', () => {
    let _UTC: (year: number, month: number) => number;

    beforeEach(() => {
      _UTC = Date.UTC;
      Date.UTC = jest.fn(() => +timestamp);
      ({ editorView } = editor(doc(paragraph('{<>}'))));
      insertText(editorView, `/date`);
      sendKeyToPm(editorView, 'Enter');
    });

    afterEach(() => {
      Date.UTC = _UTC;
    });

    it('inserts date', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(paragraph(date(attrs), ' ')),
      );
    });

    it('fires analytics event', () => {
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'date',
        eventType: 'track',
        attributes: { inputMethod: 'quickInsert' },
      });
    });
  });
});
