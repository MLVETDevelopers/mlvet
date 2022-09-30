import { Button, styled } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const StyledContainedButton = styled(Button)({
  filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.8))',
});

export const PrimaryButton = styled(StyledContainedButton)``;
PrimaryButton.defaultProps = { color: 'primary' };

export const PrimaryLoadingButton = styled(LoadingButton)({
  filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.8))',
});
PrimaryLoadingButton.defaultProps = { color: 'primary', variant: 'contained' };

export const SecondaryButton = styled(StyledContainedButton)``;
SecondaryButton.defaultProps = { color: 'secondary' };
