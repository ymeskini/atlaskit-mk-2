/**
 * @jest-environment node
 */
import * as React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';

test('Inline edit server side rendering', async () => {
  const examples = await getExamplesFor('inline-edit');
  const ex = examples[3].filePath;
  console.log(ex);
  const Example = require(ex).default;
  expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  // await getExamplesFor('inline-edit'))  (await getExamplesFor('inline-edit')).forEach((examples: {filePath: string}) => {
  //     const Example = require(examples.filePath).default;
  //     expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  //   });
});
