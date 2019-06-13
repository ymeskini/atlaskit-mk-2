import * as React from 'react';
import { Component } from 'react';
import {
  MediaClient,
  FileIdentifier,
  FileState,
  MediaFileArtifacts,
} from '@atlaskit/media-client';
import { Subscription } from 'rxjs/Subscription';
import { CustomMediaPlayer } from '@atlaskit/media-ui';
import { InlinePlayerWrapper } from './styled';
import { CardDimensions, defaultImageCardDimensions } from '..';
import { CardLoading } from '../utils/lightCards/cardLoading';

export interface InlinePlayerProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  dimensions: CardDimensions;
  selected?: boolean;
  onError?: (error: Error) => void;
  onClick?: () => void;
}

export interface InlinePlayerState {
  fileSrc?: string;
}

export const getPreferredVideoArtifact = (
  fileState: FileState,
): keyof MediaFileArtifacts | undefined => {
  if (fileState.status === 'processed' || fileState.status === 'processing') {
    const { artifacts } = fileState;
    if (!artifacts) {
      return undefined;
    }

    return artifacts['video_1280.mp4']
      ? 'video_1280.mp4'
      : artifacts['video_640.mp4']
      ? 'video_640.mp4'
      : undefined;
  }

  return undefined;
};

export class InlinePlayer extends Component<
  InlinePlayerProps,
  InlinePlayerState
> {
  subscription?: Subscription;
  state: InlinePlayerState = {};

  static defaultProps = {
    dimensions: defaultImageCardDimensions,
  };

  async componentDidMount() {
    const { mediaClient, identifier } = this.props;
    const { id, collectionName } = identifier;

    this.revoke();
    this.unsubscribe();
    this.subscription = mediaClient.file
      .getFileState(await id, { collectionName })
      .subscribe({
        next: async state => {
          if (state.status !== 'error' && state.preview) {
            const { value } = await state.preview;

            if (value instanceof Blob && value.type.indexOf('video/') === 0) {
              const fileSrc = URL.createObjectURL(value);
              this.setFileSrc(fileSrc);
              return;
            }
          }

          if (state.status === 'processed' || state.status === 'processing') {
            const artifactName = getPreferredVideoArtifact(state);
            const { artifacts } = state;
            if (!artifactName || !artifacts) {
              this.setBinaryURL();
              return;
            }

            try {
              const fileSrc = await mediaClient.file.getArtifactURL(
                artifacts,
                artifactName,
                collectionName,
              );

              this.setFileSrc(fileSrc);
            } catch (error) {
              const { onError } = this.props;

              if (onError) {
                onError(error);
              }
            }
          }
        },
      });
  }

  setFileSrc = (fileSrc: string) => {
    this.setState({ fileSrc });
    window.setTimeout(this.unsubscribe, 0);
  };

  // Tries to use the binary artifact to provide something to play while the video is still processing
  setBinaryURL = async () => {
    const { mediaClient, identifier, onError } = this.props;
    const { id, collectionName } = identifier;
    const resolvedId = await id;
    try {
      const fileSrc = await mediaClient.file.getFileBinaryURL(
        resolvedId,
        collectionName,
      );

      this.setFileSrc(fileSrc);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  revoke = () => {
    const { fileSrc } = this.state;
    if (fileSrc) {
      URL.revokeObjectURL(fileSrc);
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.revoke();
  }

  private getStyle = (): React.CSSProperties => {
    const { dimensions } = this.props;
    // We are given dimensions. But we can’t just blindly apply them as width and height.
    // Because editor is giving us “maximum” dimensions (equal to what it can go to if resized to 100%
    // of available width). And the same time we don’t want to ignore these dimensions completely,
    // because if consumer do not constraint width/height of container we still want to stick to given dimensions.
    // Here we put width as a style. In combination with max-width: 100%; and max-height: 100%;
    // it would give us required effect.
    return {
      width: dimensions.width,
    };
  };

  onDownloadClick = async () => {
    const { mediaClient, identifier } = this.props;
    const { id, collectionName } = identifier;

    mediaClient.file.downloadBinary(await id, undefined, collectionName);
  };

  render() {
    const { onClick, dimensions, selected } = this.props;
    const { fileSrc } = this.state;

    if (!fileSrc) {
      return <CardLoading dimensions={dimensions} />;
    }

    return (
      <InlinePlayerWrapper
        style={this.getStyle()}
        selected={selected}
        onClick={onClick}
      >
        <CustomMediaPlayer
          type="video"
          src={fileSrc}
          isAutoPlay
          isHDAvailable={false}
          onDownloadClick={this.onDownloadClick}
        />
      </InlinePlayerWrapper>
    );
  }
}
