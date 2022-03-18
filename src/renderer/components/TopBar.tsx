import { styled, Box, colors, Typography } from '@mui/material';

const TopBarBox = styled(Box)`
  background: ${colors.grey[900]};
  width: calc(100vw - 40px);
  margin: 0;
  padding: 20px;
`;

const TopBar = () => {
  return <TopBarBox>
    <Typography component="h1" fontWeight="bold" fontSize="24px">Machine Learning Video Editor Toolkit</Typography>
  </TopBarBox>
};

export default TopBar;
