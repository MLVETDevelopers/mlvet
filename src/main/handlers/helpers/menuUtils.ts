import { Menu } from 'electron';

const setMenuButtonEnabled: (
  menu: Menu,
  submenuId: string,
  itemId: string,
  enabled: boolean
) => void = (menu, submenuId, itemId, isEnabled) => {
  const foundSubmenu = menu.items.find((submenu) => submenu.id === submenuId);

  if (!foundSubmenu) {
    return;
  }

  const button = foundSubmenu.submenu?.items.find((item) => item.id === itemId);

  if (!button) {
    return;
  }

  button.enabled = isEnabled;
};

export default setMenuButtonEnabled;
