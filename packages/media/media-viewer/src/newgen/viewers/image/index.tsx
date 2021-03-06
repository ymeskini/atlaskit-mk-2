import * as React from 'react';

import {
  MediaClient,
  FileItem,
  FileState,
  isAbortedRequestError,
  isImageRepresentationReady,
} from '@atlaskit/media-client';
import { getOrientation } from '@atlaskit/media-ui';

import { Outcome } from '../../domain';
import { createError, MediaViewerError } from '../../error';
import { InteractiveImg } from './interactive-img';
import { AnalyticViewerProps } from '../../analytics/item-viewer';
import { BaseViewer } from '../base-viewer';

export type ObjectUrl = string;

export type ImageViewerProps = AnalyticViewerProps & {
  mediaClient: MediaClient;
  item: FileState;
  collectionName?: string;
  onClose?: () => void;
};

export interface ImageViewerContent {
  objectUrl: ObjectUrl;
  orientation?: number;
}

function processedFileStateToMediaItem(file: FileState): FileItem {
  return {
    type: 'file',
    details: {
      id: file.id,
    },
  };
}

export class ImageViewer extends BaseViewer<
  ImageViewerContent,
  ImageViewerProps
> {
  protected get initialState() {
    return { content: Outcome.pending<ImageViewerContent, MediaViewerError>() };
  }

  private cancelImageFetch?: () => void;

  protected async init() {
    const { item: file, mediaClient, collectionName } = this.props;
    if (file.status === 'error') {
      return;
    }

    try {
      let orientation = 1;
      let objectUrl: string;

      const { preview } = file;
      if (preview) {
        const { value } = await preview;
        if (value instanceof Blob) {
          orientation = await getOrientation(value as File);
          objectUrl = URL.createObjectURL(value);
        } else {
          objectUrl = value;
        }
      } else if (isImageRepresentationReady(file)) {
        const item = processedFileStateToMediaItem(file);
        const controller =
          typeof AbortController !== 'undefined'
            ? new AbortController()
            : undefined;
        const response = mediaClient.getImage(
          item.details.id,
          {
            collection: collectionName,
            mode: 'fit',
          },
          controller,
          true,
        );
        this.cancelImageFetch = () => controller && controller.abort();
        objectUrl = URL.createObjectURL(await response);
      } else {
        this.setState({
          content: Outcome.pending(),
        });
        return;
      }

      this.setState({
        content: Outcome.successful({ objectUrl, orientation }),
      });
    } catch (err) {
      // TODO : properly handle aborted requests (MS-2843)
      if (!isAbortedRequestError(err)) {
        this.setState({
          content: Outcome.failed(createError('previewFailed', err, file)),
        });
        const errorMessage = err.message || err.name;
        this.props.onLoad({ status: 'error', errorMessage });
      }
    }
  }

  protected release() {
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }

    this.state.content.whenSuccessful(({ objectUrl }) => {
      this.revokeObjectUrl(objectUrl);
    });
  }

  // This method is spied on by some test cases, so don't rename or remove it.
  public revokeObjectUrl(objectUrl: string) {
    URL.revokeObjectURL(objectUrl);
  }

  protected renderSuccessful(content: ImageViewerContent) {
    const { onClose } = this.props;
    return (
      <InteractiveImg
        onLoad={this.onLoad}
        onError={this.onError}
        src={content.objectUrl}
        orientation={content.orientation}
        onClose={onClose}
      />
    );
  }

  private onLoad = () => {
    this.props.onLoad({ status: 'success' });
    this.onMediaDisplayed();
  };

  private onError = () => {
    this.props.onLoad({
      status: 'error',
      errorMessage: 'Interactive-img render failed',
    });
  };
}
