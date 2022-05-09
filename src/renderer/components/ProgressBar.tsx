import { LinearProgress, linearProgressClasses, styled } from '@mui/material';
import colors from '../colors';

const ProgressBar = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: colors.grey[500],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: colors.yellow[500],
  },
}));

export default ProgressBar;
