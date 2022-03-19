import { Box, colors, styled } from '@mui/material';

const GenericSquareBox = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;

  background: ${colors.grey[400]};
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${colors.grey[900]};
  margin-right: 20px;

  &:last {
    margin-right: 0;
  }

  &:hover {
    background: ${colors.grey[600]};
    cursor: pointer;
  }
`;

export default GenericSquareBox;
