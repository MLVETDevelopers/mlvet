import { Menu } from 'electron';

const getMenuButton: (
  menu: Menu,
  submenuId: string,
  itemId: string
) => Electron.MenuItem | null = (menu, submenuId, itemId) => {
  const foundSubmenu = menu.items.find((submenu) => submenu.id === submenuId);

  const button = foundSubmenu?.submenu?.items.find(
    (item) => item.id === itemId
  );

  return button ?? null;
};

const setMenuButtonEnabled: (
  menu: Menu,
  submenuId: string,
  itemId: string,
  enabled: boolean
) => void = (menu, submenuId, itemId, isEnabled) => {
  const button = getMenuButton(menu, submenuId, itemId);
  if (button === null) {
    return;
  }

  button.enabled = isEnabled;
};

export default setMenuButtonEnabled;
