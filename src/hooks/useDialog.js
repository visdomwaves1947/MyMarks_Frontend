import { useContext } from 'react';
import { DialogContext } from '../components/ui/dialogContext';

/**
 * The site's own confirmation and message box. Returns { confirm, alert }:
 *   const { confirm } = useDialog();
 *   if (!(await confirm({ title: 'Delete this?', message: '...', confirmLabel: 'Delete', tone: 'danger' }))) return;
 * confirm resolves true or false; alert resolves once OK is pressed.
 */
export default function useDialog() {
  const dialog = useContext(DialogContext);
  if (!dialog) throw new Error('useDialog needs DialogProvider around the app');
  return dialog;
}
