import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr, mockConsole } from '@atlaskit/ssr';
import waitForExpect from 'wait-for-expect';

const getConsoleMockCalls = mockConsole(console);

beforeAll(() => {
  jest.setTimeout(20000);
});

afterEach(() => {
  jest.resetAllMocks();
});

test.skip('should ssr then hydrate media-filmstrip correctly', async () => {
  const [example] = await getExamplesFor('media-filmstrip');
  const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  await waitForExpect(() => {
    ReactDOM.hydrate(<Example />, elem);
    const mockCalls = getConsoleMockCalls();
    expect(mockCalls.length).toBe(0);
  });
});
