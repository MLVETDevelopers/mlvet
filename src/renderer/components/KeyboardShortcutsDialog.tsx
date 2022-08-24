import {
  Dialog,
  Box,
  Typography,
  Stack,
  styled,
  List,
  ListItem,
} from '@mui/material';
import colors from 'renderer/colors';
import { PrimaryButton } from 'renderer/components/Blocks/Buttons';

const CustomStack = styled(Stack)`
  width: 100%;
  height: 100%;
`;

const CustomModal = styled(Dialog)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomModalInner = styled(Box)`
  background: ${colors.grey[700]};
  padding: 15px 30px 30px 30px;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 544px;
  height: 550px;
`;

const CustomColumnStack = styled(CustomStack)`
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`;
const CustomRowStack = styled(CustomStack)`
  padding-top: 30px;
`;

const CustomListItem = styled(ListItem)`
  padding: 0 0 0 0;
`;

const CustomRow = ({
  wordsLeft,
  shortcutsLeft,
  wordsRight,
  shortcutsRight,
}: any) => {
  return (
    <CustomColumnStack>
      <List>
        {wordsLeft.map((word: string) => (
          <CustomListItem>
            <Typography
              variant="p-400"
              paddingTop="0px"
              color={colors.grey[300]}
            >
              {word}
            </Typography>
          </CustomListItem>
        ))}
      </List>
      <List>
        {shortcutsLeft.map((shortcut: string) => (
          <CustomListItem>
            <Typography
              variant="p-400"
              paddingTop="0px"
              color={colors.yellow[500]}
              width="125px"
            >
              {shortcut}
            </Typography>
          </CustomListItem>
        ))}
      </List>
      <List>
        {wordsRight.map((word: string) => (
          <CustomListItem>
            <Typography
              variant="p-400"
              paddingTop="0px"
              color={colors.grey[300]}
            >
              {word}
            </Typography>
          </CustomListItem>
        ))}
      </List>
      <List>
        {shortcutsRight.map((shortcut: string) => (
          <CustomListItem>
            <Typography
              variant="p-400"
              paddingTop="0px"
              color={colors.yellow[500]}
              width="125px"
            >
              {shortcut}
            </Typography>
          </CustomListItem>
        ))}
      </List>
    </CustomColumnStack>
  );
};

const KeyboardShortcutsDialog = ({ open, onClose }: any) => {
  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomModalInner>
        <CustomStack paddingTop="10px">
          <Typography variant="h1" color={colors.grey[400]}>
            Keyboard Shortcuts
          </Typography>
          <Typography
            variant="h3"
            paddingTop="10px"
            paddingBottom="10px"
            color={colors.white}
          >
            Editing
          </Typography>
          <CustomRow
            wordsLeft={['Cut', 'Copy', 'Paste', 'Undo', 'Redo']}
            shortcutsLeft={[
              'Ctrl + X/⌘ + X',
              'Ctrl + C/⌘ + C',
              'Ctrl + V/⌘ + V',
              'Ctrl + Z/⌘ + Z',
              'Ctrl + Shift + Z / ⌘ + Shift + Z',
            ]}
            wordsRight={['Delete', 'Select All', 'Merge Words', 'Split Words']}
            shortcutsRight={[
              'Backspace',
              'Ctrl + A/⌘ + A',
              'Ctrl + L/⌘ + L',
              'Ctrl + Shift + L / ⌘ + Shift + L',
            ]}
          />
          <Typography
            variant="h3"
            paddingTop="10px"
            paddingBottom="10px"
            color={colors.white}
          >
            Navigation
          </Typography>
          <CustomRow
            wordsLeft={['Open File', 'Save', 'Save As']}
            shortcutsLeft={[
              'Ctrl + O/⌘ + O',
              'Ctrl + S/⌘ + S',
              'Ctrl + Shift + S / ⌘ + Shift + S',
            ]}
            wordsRight={['Export Project', 'Return to Home']}
            shortcutsRight={[
              'Ctrl + E/⌘ + E',
              'Ctrl + Shift + H / ⌘ + Shift + H',
            ]}
          />
          <CustomRowStack>
            <PrimaryButton onClick={onClose}>Close</PrimaryButton>
          </CustomRowStack>
        </CustomStack>
      </CustomModalInner>
    </CustomModal>
  );
};

export default KeyboardShortcutsDialog;
