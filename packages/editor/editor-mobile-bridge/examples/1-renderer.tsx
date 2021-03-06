import * as React from 'react';
import styled from 'styled-components';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

import Renderer from './../src/renderer/mobile-renderer-element';
import { MentionProvider } from '@atlaskit/mention/types';

export const Wrapper: any = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

Wrapper.displayName = 'Wrapper';

// @ts-ignore
window.logBridge = window.logBridge || [];

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the mobile renderer',
        },
      ],
    },
  ],
});

const providerFactory = ProviderFactory.create({
  mentionProvider: Promise.resolve({} as MentionProvider),
});

export default function Example() {
  return (
    <Wrapper>
      <Renderer
        document={initialDocument}
        mediaProvider={storyMediaProviderFactory({
          collectionName: 'InitialCollectionForTesting',
          includeUserAuthProvider: true,
        })}
        dataProviders={providerFactory}
      />
    </Wrapper>
  );
}
