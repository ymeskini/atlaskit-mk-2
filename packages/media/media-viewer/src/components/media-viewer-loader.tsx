import * as React from 'react';
import { ModalSpinner } from '@atlaskit/media-ui';
import * as colors from '@atlaskit/theme/colors';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaViewerProps } from './types';

export type MediaViewerWithContextMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  MediaViewerProps
>;

type MediaViewerWithMediaClientConfigComponent = React.ComponentType<
  MediaViewerWithContextMediaClientConfigProps
>;

export interface AsyncMediaViewerState {
  MediaViewer?: MediaViewerWithMediaClientConfigComponent;
}

export default class AsyncMediaViewer extends React.PureComponent<
  MediaViewerWithContextMediaClientConfigProps & AsyncMediaViewerState,
  AsyncMediaViewerState
> {
  static displayName = 'AsyncMediaViewer';
  static MediaViewer?: MediaViewerWithMediaClientConfigComponent;

  state: AsyncMediaViewerState = {
    // Set state value to equal to current static value of this class.
    MediaViewer: AsyncMediaViewer.MediaViewer,
  };

  async componentWillMount() {
    try {
      if (!this.state.MediaViewer) {
        const [mediaClient, mediaViewerModule] = await Promise.all([
          import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
          import(/* webpackChunkName:"@atlaskit-internal_media-viewer" */ './media-viewer'),
        ]);

        const MediaViewerWithClient = mediaClient.withMediaClient(
          mediaViewerModule.MediaViewer,
        );
        AsyncMediaViewer.MediaViewer = MediaViewerWithClient;
        this.setState({ MediaViewer: MediaViewerWithClient });
      }
    } catch (error) {
      // TODO [MS-2277]: Add operational error to catch async import error
    }
  }

  render() {
    if (!this.state.MediaViewer) {
      return (
        <ModalSpinner blankedColor={colors.DN30} invertSpinnerColor={true} />
      );
    }

    return <this.state.MediaViewer {...this.props} />;
  }
}
