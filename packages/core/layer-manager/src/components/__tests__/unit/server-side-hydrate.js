// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';
import waitForExpect from 'wait-for-expect';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate layer-manager correctly', async () => {
  const [example] = await getExamplesFor('layer-manager');
  // $StringLitteral
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  // $FlowFixMe - Cannot call await with `ssr(...)` bound to `p.
  elem.innerHTML = await ssr(example.filePath);
  await waitForExpect(() => {
    ReactDOM.hydrate(<Example />, elem);
    // ignore warnings caused by emotion's server-side rendering approach
    // eslint-disable-next-line no-console
    const mockCalls = console.error.mock.calls.filter(
      ([f, s]) =>
        !(
          f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.' &&
          s === 'style'
        ),
    );
    expect(mockCalls.length).toBe(0);
  });
});
