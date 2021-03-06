import { HistoryPluginState } from './index';
import { HistoryAction, HistoryActionTypes } from './actions';

const reducer = (
  state: HistoryPluginState,
  action: HistoryAction,
): HistoryPluginState => {
  switch (action.type) {
    case HistoryActionTypes.UPDATE:
      return {
        canUndo: action.canUndo,
        canRedo: action.canRedo,
      };
  }

  return state;
};

export default reducer;
