import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  const { title, contentText, isDialogOpened, handleCloseDialog, handleConfirm } = props
  const deleteButton = React.useRef();
  const cancelButton = React.useRef();


  document.addEventListener('keydown', (event) => {
    if ( isDialogOpened === false ) {
      return
    }
    var noFocus
    if (document.activeElement !== cancelButton.current 
      && document.activeElement !== deleteButton.current) {
        noFocus = true
      } 
    if (event.key === 'ArrowRight') {
      if (document.activeElement === cancelButton.current || noFocus === true ) {
        deleteButton.current.focus()
      }
    } else if (event.key === 'ArrowLeft') {
      if (document.activeElement === deleteButton.current || noFocus === true ) {
        cancelButton.current.focus()
      }
    }
  }, false);


  return (
    <div>
      <Dialog
        open={isDialogOpened}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { title }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { contentText }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button ref={cancelButton} onClick={handleCloseDialog} autoFocus>Cancel</Button>
          <Button ref={deleteButton} onClick={handleConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
