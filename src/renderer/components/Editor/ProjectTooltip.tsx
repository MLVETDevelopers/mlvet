import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import colors from 'renderer/colors';

const ProjectTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
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
