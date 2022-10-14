import { styled, Tooltip, TooltipProps } from '@mui/material';
import colors from 'renderer/colors';

const tooltipComponent = ({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
);
const ProjectTooltip = styled(tooltipComponent)(() => ({
  '.MuiTooltip-tooltip': {
    backgroundColor: colors.white,
    color: colors.grey[900],
    fontSize: '16px',
    fontFamily: 'Rubik',
  },
}));

export default function toolTipFunction(props: TooltipProps) {
  return (
    <ProjectTooltip title={props.title}>
      <span>{props.children}</span>
    </ProjectTooltip>
  );
}
