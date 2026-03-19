import React from 'react';
import './Modal.scss';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Zoom } from '@mui/material'; // Collapse, Fade, Grow, Slide,
import { IoCloseOutline } from 'react-icons/io5';

interface ModalComponentProps {
  children: React.ReactNode;
  title?: string;
  initialOpen?: boolean;
}

export default function ModalComponent({
  title,
  initialOpen = false,
  children,
}: ModalComponentProps) {
  const [open, setOpen] = React.useState(initialOpen || false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="onepage-modal"
      >
        <Zoom in={open} timeout={500}>
          <Box className="onepage-modal__box">
            <Box className="onepage-modal__head">
              <Typography id="onepage-modal__title" variant="h6" component="h2">
                {title || ''}
              </Typography>
              <Box className="onepage-modal__close">
                <IconButton
                  aria-label="Close modal"
                  color="secondary"
                  size="small"
                  onClick={handleClose}
                >
                  <IoCloseOutline size={32} />
                </IconButton>
              </Box>
            </Box>
            <Box>{children}</Box>
          </Box>
        </Zoom>
      </Modal>
    </div>
  );
}
