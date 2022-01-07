import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress'
import { withRouter } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import DialogCommentColumn from 'components/layout/user/DialogCommentColumn';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots as fasCommentDots } from '@fortawesome/free-solid-svg-icons';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    position: 'fixed',
    top: '0'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
  },
  iconStyle: {
      color: '#000000',
      textAlign: 'center',
      fontSize: '20px'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogComment = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    setTimeout(function() {
        window.onpopstate = function (event) {
            if(open){
                handleClose();
            }else if(props.open){
                setComment('');
                props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
                props.handleClose();
            }
        }
    }, 100)
    const handleClickClose = () => {
        props.history.goBack();
        setComment('');
        props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
        props.handleClose();
    }
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        window.history.pushState(null, null, '');
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const [comment, setComment] = useState('');
    const handleChangeComment = (event) => {
        event.target.style.height = '0px';
        event.target.style.height = (event.target.scrollHeight-5) + 'px';
        setComment(event.target.value);
    }
    const handleKeyDownComment = (event) => {
        if(event.key === 'Backspace' && !comment){
            props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
        }
    }
    const [loding, setLoding] = useState(false);
    const handleClickComment = async() => {
        document.getElementById('comment_content').style.height = 'auto';
        if(comment){
            const data = {
                board_no: props.boardComment_boardNo, 
                user_no: props.user.user_no,
                comment: comment,
                recomment_no: props.recomment.recommentNo,
                recomment_user: props.recomment.recommentUser
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post("/api/comment", data, config).then((response)=>{
                setLoding(true);
                setComment('');
                props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
                setTimeout(() => {
                    props.setComments(response.data);
                    setLoding(false);
                },[1200])
            }); 
        }
    }
    return (
        <>
            <Dialog fullScreen open={props.open} onClose={handleClickClose} TransitionComponent={Transition} style={{width: '100%', zIndex: '1398'}}>
                <AppBar className={classes.appBar}>
                <Toolbar>
                    <Grid item container alignItems="center">
                        <Grid item xs={5} style={{textAlign: 'left'}}>
                            <IconButton edge="start" onClick={handleClickClose} aria-label="close">
                                <CloseIcon className={classes.iconStyle}/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="h6" className={classes.title}>
                                댓글
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <div style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.5)'}}>{props.commentCount}</div>
                        </Grid>
                    </Grid>
                </Toolbar>
                </AppBar>
                <div style={{paddingBottom: '50px', margin: '70px 0px', padding: '0px 10px'}}> 
                    {props.children}
                </div>
                {props.user.user_no ? 
                props.boardKind !== '5' ?
                <Grid item container justify="space-between" alignItems="center" className="comment_create_form">
                    <Grid item xs={1}>
                        <Avatar 
                            src={props.user.user_profile} 
                            alt="" 
                            style={{width: '30px', height: '30px', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}
                        />
                    </Grid>
                    <Grid item xs={8} className="comment_create_form_content">
                        {props.recomment.recommentUserName ? <Chip label={props.recomment.recommentUserName} size="small" onDelete={() => props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''})}/> : null}
                        <textarea
                            id='comment_content'
                            placeholder={`댓글을 입력해주세요.`}
                            value={comment}
                            onChange={handleChangeComment} 
                            onKeyDown={handleKeyDownComment}
                            rows={1}
                            style={{height: 'auto'}}
                        >
                        </textarea>
                    </Grid>
                    <Grid item xs={2}>
                        <button onClick={handleClickComment}>
                        {loding ?
                            <div style={{textAlign: 'right'}}>
                                <CircularProgress  style={{width: '20px', height: '20px'}}  />
                            </div>:
                            '입력'
                        }
                        </button>
                    </Grid>
                </Grid>
                : 
                props.writeUser === props.user.user_no ?
                <Grid item container justify="space-between" alignItems="flex-end" className="comment_create_form">
                    <Grid item xs={1}>
                        <Avatar 
                            src={props.user.user_profile} 
                            alt="" 
                            style={{width: '30px', height: '30px', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}
                        />
                    </Grid>
                    {props.recomment.recommentNo ? 
                    <>
                    <Grid item xs={8} className="comment_create_form_content">
                        {props.recomment.recommentUserName ? <Chip label={props.recomment.recommentUserName} size="small" onDelete={() => props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''})}/> : null}
                        <textarea
                            id='comment_content'
                            placeholder={`댓글을 입력해주세요.`}
                            value={comment}
                            onChange={handleChangeComment} 
                            onKeyDown={handleKeyDownComment}
                            rows={1}
                            style={{height: 'auto'}}
                        >
                        </textarea>
                    </Grid>
                    <Grid item xs={2}>
                        <button onClick={handleClickComment}>
                        {loding ?
                            <div style={{textAlign: 'right'}}>
                                <CircularProgress  style={{width: '20px', height: '20px'}} />
                            </div>:
                            '입력'
                        }
                        </button>
                    </Grid>
                    </>
                    :
                    <>
                    <Grid item xs={8} className="comment_create_form_content">
                        {props.recomment.recommentUserName ? <Chip label={props.recomment.recommentUserName} size="small" onDelete={() => props.setRecomment({recommentNo: 0, recommentUser: 0, recommentUserName: ''})}/> : null}
                        <textarea
                            disabled
                            placeholder={`답글 대상을 선택해 주세요.`}
                            rows={1}
                        >
                        </textarea>
                    </Grid>
                    <Grid item xs={2}>
                        <button>
                        {loding ?
                            <div style={{textAlign: 'right'}}>
                                <CircularProgress  style={{width: '20px', height: '20px'}}  />
                            </div>:
                            '입력'
                        }
                        </button>
                    </Grid>
                    </>}
                </Grid>
                :
                <Fab color="primary" aria-label="add" className='board_create' onClick={handleOpen}>
                    <FontAwesomeIcon icon={fasCommentDots} style={{fontSize: '24px'}} />
                </Fab>
                :
                <Grid item container justify="space-between" alignItems="center" className="comment_create_form">
                    <Grid item xs={1}>
                        <Avatar 
                            src={props.user.user_profile} 
                            alt="" 
                            style={{width: '30px', height: '30px', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}
                        />
                    </Grid>
                    <Grid item xs={8} className="comment_create_form_content">
                        <textarea
                            placeholder={`로그인이 필요합니다.`}
                            rows={1}
                            disabled={true}
                        >
                        </textarea>
                    </Grid>
                    <Grid item xs={2}>
                        <button onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}>
                            로그인
                        </button>
                    </Grid>
                </Grid>
                }
            </Dialog>
            <DialogCommentColumn
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                setLoding={setLoding}
                setComments={props.setComments}
                boardNo={props.boardComment_boardNo}
                userNo={props.user.user_no}
            />   
        </>
    );
}
export default withRouter(DialogComment);