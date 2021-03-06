import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MuiRating from '@material-ui/lab/Rating';
import { Close } from '@material-ui/icons'
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'react-router';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Rating = withStyles({
  root: {
    color: '#5093FF',
    fontSize: '40px',
    padding: '20px 0px 10px 0px'
  },
})(MuiRating);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 const DialogSave = (props) => {
  const [cookies] = useCookies('userKey');
  const [comment, setComment] = useState('');
  const handleChangeValue = (event) => {
    setComment(event.target.value);
  }
  const handleClickComment = async() => {
      if(comment){
          const data = {
              comment: comment,
              user_no: props.userNo,
              board_no: props.boardNo,
              rating: rating
          }
          const config = {
              headers: {
                  "content-type": "application/json"
              }
          };
          await axios.post("/api/comment/column", data, config).then((response)=>{
              handleClickClose();
              props.setLoding(true);
              setTimeout(() => {
                  props.setComments(response.data);
                  props.setLoding(false);
              },[1200])
          }); 
      }
  }
  const handleClickClose = () => {
    setComment('');
    setRating(3);
    props.history.goBack();
    props.handleClose();
  }
  const [rating, setRating] = useState(3);
  const ratingKr = ['?????? ?????? ?????? ????????????', '?????? ?????? ????????????', '?????????', '????????????', '???????????????', '???????????????', '???????????????', '?????????', '?????? ?????????', '?????? ?????? ?????????'];
  return (
    <div>
      <Dialog
        fullWidth={true}
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={{zIndex: '1399'}}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Grid item container justify="center" alignItems="center">
            
            <Grid item xs={10} className="comment_create_column_title">?????? ??????</Grid>
            
          </Grid>
        </DialogTitle>
        <DialogContent style={{padding: '8px 10px'}}>
          <DialogContentText id="alert-dialog-slide-description" className="comment_create_column_content">
          ???????????? ?????? ??????????????????~<br />???????????? ????????? ??? ?????? ?????????.<br />
          <Rating 
            name="size-large" 
            defaultValue={rating} 
            precision={0.5} 
            onChange={(event, newValue) => setRating(newValue)}
          />
          <br/>
          {rating ? 
          <p>{rating}??? ({ratingKr[rating*2-1]})</p>:
          <p>????????? ???????????????.</p>
          }
          <Divider />
          <div className="comment_create_column_text">
              {cookies.userKey ?
              <textarea rows={15} className="board_create_form" placeholder="????????? ????????? ?????????." value={comment} onChange={handleChangeValue} ></textarea>
              :<textarea rows={15} className="board_create_form" disabled placeholder="???????????? ???????????????." value={comment}></textarea>}
          </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item container justify="flex-end" alignContent="end">
          <Grid item xs={12} style={{textAlign: 'right', marginBottom: '20px'}}>
              <button onClick={handleClickClose} color="primary" className="coment_cancle_column_button board_create_form" style={{marginRight: '5px'}}>
                ??????
              </button>
              <button onClick={handleClickComment} disabled={!comment ? true : false} color="primary" className="coment_create_column_button board_create_form">
                ??????
              </button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouter(DialogSave);