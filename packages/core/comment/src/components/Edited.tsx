import React, { Component, ReactNode } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import EditedStyles from '../styled/EditedStyles';

interface Props {
  /** Content to render indicating that the comment has been edited. */
  children?: ReactNode;
  /** Handler called when the element is focused. */
  onFocus?: (event: React.FocusEvent<HTMLSpanElement>) => void;
  /** Handler called when the element is moused over. */
  onMouseOver?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

class Edited extends Component<Props, {}> {
  render() {
    const { children, onFocus, onMouseOver } = this.props;
    return (
      <EditedStyles onFocus={onFocus} onMouseOver={onMouseOver}>
        {children}
      </EditedStyles>
    );
  }
}

export { Edited as CommentEditedWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext<Props>({
  componentName: 'commentEdited',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents<Props>({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentEdited',

      attributes: {
        componentName: 'commentEdited',
        packageName,
        packageVersion,
      },
    }),
  })(Edited),
);
