import {
  Dialog,
  Box,
  Typography,
  Stack,
  styled,
  List,
  ListItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import colors from 'renderer/colors';
import { PrimaryButton } from 'renderer/components/Blocks/Buttons';
import ipc from 'renderer/ipc';
import { OperatingSystems } from 'sharedTypes';

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
  padding-top: 80px;
`;

const CustomListItem = styled(ListItem)`
  padding: 0 0 0 0;
`;

interface RowProps {
  wordsLeft: string[];
  shortcutsLeft: string[];
  wordsRight: string[];
  shortcutsRight: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

interface ListProps {
  listItems: string[];
  color: string;
}

const CustomList = ({ listItems, color }: ListProps) => {
  return (
    <List>
      {listItems.map((item: string) => (
        <CustomListItem>
          <Typography variant="p-400" paddingTop="0px" color={color}>
            {item}
          </Typography>
        </CustomListItem>
      ))}
    </List>
  );
};

const CustomRow = ({
  wordsLeft,
  shortcutsLeft,
  wordsRight,
  shortcutsRight,
}: RowProps) => {
  return (
    <CustomColumnStack>
      <CustomList key="col1" listItems={wordsLeft} color={colors.grey[300]} />
      <CustomList
        key="col2"
        listItems={shortcutsLeft}
        color={colors.yellow[500]}
      />
      <CustomList key="col3" listItems={wordsRight} color={colors.grey[300]} />
      <CustomList
        key="col4"
        listItems={shortcutsRight}
        color={colors.yellow[500]}
      />
    </CustomColumnStack>
  );
};

const KeyboardShortcutsDialog = ({ open, onClose }: Props) => {
  const [currentOs, setCurrentOs] = useState<OperatingSystems | null>(null);

  const getOs = async () => {
    const osFound = await ipc.handleOsQuery();
    setCurrentOs(osFound);
  };

  useEffect(() => {
    getOs();
  });

  const CTRL_OR_CMD = currentOs === OperatingSystems.MACOS ? '⌘' : 'Ctrl';

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
            key="row1"
            wordsLeft={['Cut', 'Copy', 'Paste', 'Undo', 'Redo']}
            shortcutsLeft={[
              `${CTRL_OR_CMD} + X`,
              `${CTRL_OR_CMD} + C`,
              `${CTRL_OR_CMD} + V`,
              `${CTRL_OR_CMD} + Z`,
              `${CTRL_OR_CMD} + Shift + Z`,
            ]}
            wordsRight={['Delete', 'Select All', 'Merge Words', 'Split Words']}
            shortcutsRight={[
              'Backspace',
              `${CTRL_OR_CMD} + A`,
              `${CTRL_OR_CMD} + L`,
              `${CTRL_OR_CMD} + Shift + L`,
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
            key="row2"
            wordsLeft={['Open File', 'Save', 'Save As']}
            shortcutsLeft={[
              `${CTRL_OR_CMD} + O`,
              `${CTRL_OR_CMD} + S`,
              `${CTRL_OR_CMD} + Shift + S`,
            ]}
            wordsRight={['Export Project', 'Return to Home']}
            shortcutsRight={[
              `${CTRL_OR_CMD} + E`,
              `${CTRL_OR_CMD} + Shift + H`,
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
