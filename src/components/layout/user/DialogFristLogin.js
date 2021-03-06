import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
 const DialogFristLogin = (props) => {
  const handleClickCreateBoard = () => {
    props.handleClose();
    props.setBoardCreateOpen();
  }
  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => props.handleClose()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">πμΆνν©λλ€.π</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            μ²« κ²μκΈμ μμ±νλ¬ κ°λ³ΌκΉμ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item container justify="flex-end">
          {/* <Grid item container justify="space-between">
            <Grid item xs={3}>
              <Button onClick={() => props.handleClickCreate()} color="primary">
                μμμ μ₯
              </Button>
            </Grid> */}
            <Grid item xs={12} style={{textAlign: 'right'}}>
              <Button color="primary" onClick={() => props.handleClose()}>
                μ·¨μ
              </Button>
              <Button color="primary" onClick={handleClickCreateBoard}>
                κ²μκΈ μμ±
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(DialogFristLogin);