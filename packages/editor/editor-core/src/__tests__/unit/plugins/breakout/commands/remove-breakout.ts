import {
  createEditorFactory,
  doc,
  code_block,
  breakout,
} from '@atlaskit/editor-test-helpers';
import { removeBreakout } from '../../../../../plugins/breakout/commands/remove-breakout';

describe('Breakout Commands: remove-breakout', () => {
  const createEditor = createEditorFactory();

  it('should remove breakout mark from a given node', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      editorProps: {
        allowBreakout: true,
        appearance: 'full-page',
      },
    });

    removeBreakout()(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(doc(code_block()('Hello')));
  });
});
