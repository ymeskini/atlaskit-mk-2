/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Tag server side rendering', async done => {
  (await getExamplesFor('tag')).forEach(
    async (examples: { filePath: string }) => {
      // $StringLitteral
      const Example = await require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
  done();
});
