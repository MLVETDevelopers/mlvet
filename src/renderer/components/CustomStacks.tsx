import { Stack, styled } from '@mui/material';

export const CustomStack = styled(Stack)({ width: '100%' });

export const CustomColumnStack = styled(CustomStack)({
  flexDirection: 'column',
});

export const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
});
