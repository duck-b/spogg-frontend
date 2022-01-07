import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Edit, Delete, Share, Close, PersonAdd, PersonAddDisabled, Report } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH as fasEllipsisH } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';


const BoardGramEtc = (props) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [cookies] = useCookies('userKey');
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleClickDeleteQuestion = () => {
        enqueueSnackbar(`게시글을 삭제합니다. 삭제 시 복구할 수 없습니다.`, 
        {   
            variant: 'warning', 
            action: <div className="alret_action">
                <button 
                    onClick={() => closeSnackbar()}
                >취소
                </button>
                <button 
                    onClick={handleClickDelete}
                >삭제
                </button>
            </div>
        })
     }
    
    const handleClickDelete = () => {
        props.handleClickDelete(props.contentKey,'board_delete');
    }
    const handleClickShare = () => {
        handleClose();
        enqueueSnackbar(`URL이 복사되었습니다.`, { variant: 'info'});
        setTimeout(() => {
            const dummy   = document.createElement("input");
            const text    = `${window.location.origin}/board/1/${props.value.boardNo}`;
        
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
        },[500])
    }
    
    const handleClickReport = () => {
        enqueueSnackbar(`신고 접수가 완료되었습니다. 빠른 시일 내 조치하겠습니다.`, { variant: 'success'});
    }
    return (
        <>
        <IconButton aria-label="share" className="card_content_icon" onClick={handleClickOpen} >
            <FontAwesomeIcon icon={fasEllipsisH} />
        </IconButton>
        <Drawer anchor="bottom" open={open} style={{zIndex: '1501'}} onClose={handleClose} onClick={handleClose}>
            <div
            style={{width: 'auto'}}
            role="presentation"
            onKeyDown={handleClose}
            >
                {props.value.thisUser ?
                <List>
                    <ListItem button onClick={() => props.history.push(`/board/1/${props.value.boardNo}/update`)}>
                        <ListItemIcon><Edit /></ListItemIcon>
                        <ListItemText primary="수정" />
                    </ListItem>
                    <ListItem button onClick={handleClickDeleteQuestion}>
                        <ListItemIcon><Delete /></ListItemIcon>
                        <ListItemText primary="삭제" />
                    </ListItem>
                    <ListItem button onClick={handleClickShare}>
                        <ListItemIcon><Share /></ListItemIcon>
                        <ListItemText primary="게시글 공유" />
                    </ListItem>
                    <ListItem button onClick={handleClose}>
                        <ListItemIcon><Close /></ListItemIcon>
                        <ListItemText primary="닫기" />
                    </ListItem>
                </List>
                :
                <List>
                    <ListItem button onClick={handleClickShare}>
                        <ListItemIcon><Share /></ListItemIcon>
                        <ListItemText primary="게시글 공유" />
                    </ListItem>
                    {props.value.userFollow ? 
                    <ListItem button onClick={()=> props.handleClickFollow(props.contentKey)}>
                        <ListItemIcon><PersonAddDisabled /></ListItemIcon>
                        <ListItemText primary="팔로우 취소" />
                    </ListItem>:
                    <ListItem button onClick={()=> props.handleClickFollow(props.contentKey)}>
                        <ListItemIcon><PersonAdd /></ListItemIcon>
                        <ListItemText primary="팔로우" />
                    </ListItem>}
                    <ListItem button onClick={handleClickReport}>
                        <ListItemIcon><Report /></ListItemIcon>
                        <ListItemText primary="신고" />
                    </ListItem>
                    <ListItem button onClick={handleClose}>
                        <ListItemIcon><Close /></ListItemIcon>
                        <ListItemText primary="닫기" />
                    </ListItem>
                </List>
                }
            </div>
        </Drawer>
        </>
    );
}

export default withRouter(BoardGramEtc);