import { AppNavigationTheme } from '../../theme';
import { TriggerManagerProps } from '../TriggerManager/types';

export type HelpProps = Omit<TriggerManagerProps, 'children'> & {
  tooltip: string;
  theme: AppNavigationTheme;
};