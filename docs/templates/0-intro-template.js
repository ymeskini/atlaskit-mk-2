// @flow

import React from 'react';
import {
  code,
  md,
  Example,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

// The core parts of the intro page for your examples documentation are:\
// 0. If your component is in developer preview and/or is designed for internal Atlassian development,
//    you can add a section message indicating it.
// 1. A summary description
// 2. An example of how to import the component as a codeblock, showing sub-components as well
// 3. An example pulled from the examples folder which shows the most basic implementation
// 4. A flexible spot for more descriptions and possible more examples to help convey extra meaning
// 5. Props information. If your package exports multiple components, you should add a props heading for
//    each, or use separate pages in docs to document each exported component.

export default md`
  TODO: If your component is designed for internal Atlassian development
  ${(<AtlassianInternalWarning />)}

  TODO: If your component is in developer preview
  ${(<DevPreviewWarning />)}

  TODO: If your component is both for internal Atlassian development and in developer preview
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  TODO: Summary of what the component is/is for

  ## Usage

  ${/* This code snippet should show all the exports of a component */ ''}
  ${code`
    import Component, { SubComponent } from '@atlaskit/component';
  `}

  TODO: Provide the base information that someone needs to render the component

  ${
    /* You should use as many examples as your explanation needs. There
  should be at least one base example present, unless your component cannot
  be rendered inline */ ''
  }
  ${(
    <Example
      Component={require('pathToExample').default}
      title="Basic"
      source={require('!!raw-loader!pathToExample')}
    />
  )}

  ${(
    <Props
      heading="Component Props"
      props={require('!!extract-react-types-loader!pathToComponentsSource')}
    />
  )}
`;
