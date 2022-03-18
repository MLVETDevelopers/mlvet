import { Box, Modal, Typography } from "@mui/material";
import SelectMediaBlock from "./SelectMediaBlock";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const NewProjectModal = (props: Props) => {
  const { isOpen, closeModal } = props;

  return <Modal open={isOpen} onClose={closeModal}>
    <Box>
      <Typography>Project Name</Typography>
      <SelectMediaBlock />
    </Box>
  </Modal>
};

export default NewProjectModal;
