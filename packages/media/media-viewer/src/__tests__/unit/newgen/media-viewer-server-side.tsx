/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test('media-viewer server side rendering', async done => {
  (await getExamplesFor('media-viewer')).forEach((examples: any) => {
    const Example = require(examples.filePath).default;

    expect(async () =>
      ReactDOMServer.renderToString(<Example />),
    ).not.toThrowError();
  });
  done();
});
