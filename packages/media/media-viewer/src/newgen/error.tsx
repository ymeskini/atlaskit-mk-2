import * as React from 'react';
import { ReactNode } from 'react';
import { ErrorMessageWrapper, ErrorImage } from './styled';
import { FileItem } from '@atlaskit/media-core';
import { cannotViewFile, errorLoadingFile } from './error-images';

export type ErrorName =
  | 'previewFailed'
  | 'metadataFailed'
  | 'unsupported'
  | 'linksNotSupported'
  | 'idNotFound'
  | 'noPDFArtifactsFound';

export type Props = Readonly<{
  error: MediaViewerError;
  children?: ReactNode;
}>;

const errorLoadingFileImage = (
  <ErrorImage src={errorLoadingFile} alt="Error loading file" />
);
const cannotViewFileImage = (
  <ErrorImage src={cannotViewFile} alt="Error generating preview" />
);

const messages = new Map<ErrorName, ReactNode>();
messages.set(
  'metadataFailed',
  <div>
    {errorLoadingFileImage}
    <p>Something went wrong.</p>
    <p>It might just be a hiccup.</p>
  </div>,
);
messages.set(
  'previewFailed',
  <div>
    {cannotViewFileImage}
    <p>We couldn't generate a preview for this file.</p>
  </div>,
);
messages.set(
  'unsupported',
  <div>
    {cannotViewFileImage}
    <p>We can't preview this file type.</p>
  </div>,
);
messages.set(
  'idNotFound',
  <div>
    {errorLoadingFileImage}
    <p>The selected item was not found on the list</p>
  </div>,
);
messages.set(
  'noPDFArtifactsFound',
  <div>
    {cannotViewFileImage}
    <p>No PDF artifacts found for this file.</p>
  </div>,
);
messages.set(
  'linksNotSupported',
  <div>
    {errorLoadingFileImage}
    <p>Links are not supported.</p>
  </div>,
);

export class MediaViewerError {
  private _name: ErrorName;
  private _fileItem?: FileItem;
  private _error?: Error;

  constructor(name: ErrorName, fileItem?: FileItem, error?: Error) {
    this._fileItem = fileItem;
    this._name = name;
    this._error = error;
  }

  get fileItem(): FileItem | undefined {
    return this._fileItem;
  }

  get errorName(): ErrorName {
    return this._name;
  }

  get innerError(): Error | undefined {
    return this._error;
  }
}

export const createError = (
  name: ErrorName,
  fileItem?: FileItem,
  innerError?: Error,
): MediaViewerError => {
  return new MediaViewerError(name, fileItem, innerError);
};

export class ErrorMessage extends React.Component<Props, {}> {
  render() {
    const errorMessage = messages.get(this.props.error.errorName);
    return (
      <ErrorMessageWrapper>
        {errorMessage}
        {this.props.children}
      </ErrorMessageWrapper>
    );
  }
}
