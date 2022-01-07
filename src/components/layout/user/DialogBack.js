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

 const DialogBack = (props) => {
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
        <DialogTitle id="alert-dialog-slide-title">수정중인 글이 있습니다.</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            '나가기' 버튼 클릭 시 이전 페이지로 이동되며, 입력한 내용은 저장되지 않습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item container justify="flex-end">
            <Grid item xs={6} style={{textAlign: 'right'}}>
              <Button onClick={() => props.handleClose()} color="primary">
                취소
              </Button>
              <Button onClick={() => props.history.goBack()} color="primary">
                나가기
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(DialogBack);