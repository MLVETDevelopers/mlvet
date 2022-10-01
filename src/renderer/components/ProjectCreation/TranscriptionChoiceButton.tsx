import { Stack, Typography } from '@mui/material';
import CloudIcon from '@mui/icons-material/CloudQueue';
import LocalIcon from '@mui/icons-material/Laptop';
import colors from 'renderer/colors';

export enum TranscriptionChoiceButtonTypes {
  LOCAL = 'LOCAL',
  CLOUD = 'CLOUD',
}

interface TranscriptionChoiceButtonProps {
  type: TranscriptionChoiceButtonTypes;
  onClick: () => void;
  isSelected: boolean;
}

const TranscriptionChoiceButton = ({
  type,
  onClick,
  isSelected,
}: TranscriptionChoiceButtonProps) => {
  const TranscriptionChoiceButtonInfo = {
    [TranscriptionChoiceButtonTypes.LOCAL]: {
      text: 'Local',
      icon: (
        <LocalIcon
          id="choice-button-icon"
          sx={{ fontSize: '60px', color: colors.grey[500] }}
        />
      ),
    },
    [TranscriptionChoiceButtonTypes.CLOUD]: {
      text: 'Cloud',
      icon: (
        <CloudIcon
          id="choice-button-icon"
          sx={{ fontSize: '60px', color: colors.grey[500] }}
        />
      ),
    },
  };

  const buttonInfo = TranscriptionChoiceButtonInfo[type];

  return (
    <Stack
      id="choice-button"
      onClick={onClick}
      className={isSelected ? 'selected' : ''}
      sx={{
        width: { xs: '100px', sm: '160px' },
        height: { xs: '100px', sm: '160px' },
        justifyContent: 'center',
        alignItems: 'center',
        paddingX: '50px',
        backgroundColor: colors.grey[600],
        border: `1px solid ${colors.grey[600]}`,
        borderRadius: '5px',
        '&:hover': {
          borderColor: colors.yellow[500],
          transition: 'border-color 0.14s ease-in-out',
          '#choice-button-icon': {
            transition: 'color 0.14s ease-in-out',
            color: colors.yellow[500],
          },
          '#choice-button-text': {
            transition: 'color 0.14s ease-in-out',
            color: colors.yellow[500],
          },
        },
        '&.selected': {
          borderColor: colors.yellow[500],
          borderWidth: '2px',
          transition: 'border-color 0.14s ease-in-out',
          '#choice-button-icon': {
            transition: 'color 0.14s ease-in-out',
            color: colors.yellow[500],
          },
          '#choice-button-text': {
            transition: 'color 0.14s ease-in-out',
            color: colors.yellow[500],
          },
        },
      }}
    >
      <Stack sx={{ alignItems: 'center' }}>
        {buttonInfo.icon}
        <Typography
          variant="body1"
          id="choice-button-text"
          sx={{ fontSize: '15px', lineHeight: '18px', color: colors.grey[500] }}
        >
          {buttonInfo.text}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TranscriptionChoiceButton;
