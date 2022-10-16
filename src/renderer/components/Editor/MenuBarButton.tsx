import { ButtonProps, colors, IconButton } from '@mui/material';
import ProjectTooltip from './ProjectTooltip';

interface MenuBarButtonProps extends ButtonProps {
  text: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MenuBarButton = ({
  text,
  children,
  onClick,
  ...rest
}: MenuBarButtonProps) => {
  return (
    <ProjectTooltip title={text}>
      <IconButton sx={{ color: colors.grey[300] }} onClick={onClick} {...rest}>
        {children}
      </IconButton>
    </ProjectTooltip>
  );
};

export default MenuBarButton;
