import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {

  const handleClose = () => {
    props.handleCloseDialog(false);
    props.isAccept(false);
  };
  const handleAccept = () => {
    props.handleCloseDialog(false);
    props.isAccept(true);
  };

  return (
    <div>
      <Dialog
        open={props.open? true: false}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{props.cancel}</Button>
          <Button onClick={handleAccept}>{props.accept}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
