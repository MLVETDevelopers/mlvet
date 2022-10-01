import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import {
  CustomStack,
  CustomColumnStack,
  CustomRowStack,
} from '../../CustomStacks';
import colors from '../../../colors';

interface Props {
  subtitle: string;
  children: ReactNode;
}

const LocalConfigBlock = ({ subtitle, children }: Props) => {
  return (
    <CustomColumnStack justifyContent="space-between" sx={{ height: '50%' }}>
      <CustomStack justifyContent="space-between">
        <CustomStack>
          <Typography
            variant="p-300"
            sx={{
              marginTop: '16px',
              marginBottom: '35px',
              color: colors.grey[300],
            }}
          >
            {subtitle}
          </Typography>
          <CustomRowStack
            sx={{ marginBottom: '32px', justifyContent: 'space-between' }}
          >
            <Typography
              variant="p-300"
              sx={{ color: colors.grey[300], fontWeight: 500 }}
            >
              Local Transcription Tool
            </Typography>
            <Typography variant="p-300" sx={{ color: colors.grey[300] }}>
              Size: 1.8GB
            </Typography>
          </CustomRowStack>
          {children}
        </CustomStack>
      </CustomStack>
    </CustomColumnStack>
  );
};

export default LocalConfigBlock;
