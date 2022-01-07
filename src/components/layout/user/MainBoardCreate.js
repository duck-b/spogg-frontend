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
import IconPlayCreate from 'img/icon_play_create.png';
import IconReviewCreate from 'img/icon_review_create.png'
import IconGramCreate from 'img/icon_gram_create.png'
import IconVideoCreate from 'img/icon_video_create.png'
import IconColumnCreate from 'img/icon_column_create.png'
import { Edit, Delete, Share, Close, PersonAdd, PersonAddDisabled, Report } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH as fasEllipsisH } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';


const MainBoardCreate = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const [cookies] = useCookies('userKey');
    
    const handleClickButton = (kind) => {
        if(kind === 2 || kind === 4){
            enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
            props.handleClose();
        }else{
            if(!cookies.userKey){
                enqueueSnackbar(`로그인이 필요합니다.`, 
                {   
                    variant: 'warning', 
                    action: <div className="alret_action">
                        <button 
                            onClick={() => props.history.push({pathname: `/user/login`, state: `/board/${kind}/create`})}
                        >로그인
                        </button>
                    </div>
                })
            }else{
                props.history.push(`/board/${kind}/create`);
            }
        }
     }
    
    return (
        <Drawer anchor="bottom" open={props.open} style={{zIndex: '1501'}} onClose={props.handleClose} onClick={props.handleClose}>
            <div
            style={{width: 'auto'}}
            role="presentation"
            onKeyDown={props.handleClose}
            >
                <List>
                    <ListItem button onClick={() => handleClickButton(1)}>
                        <ListItemIcon><img src={IconPlayCreate} className="main_board_create_icon" alt="" /></ListItemIcon>
                        <ListItemText primary="상품연계" />
                    </ListItem>
                    <ListItem button  onClick={() => handleClickButton(2)}>
                        <ListItemIcon><img src={IconReviewCreate} className="main_board_create_icon" alt=""/></ListItemIcon>
                        <ListItemText primary="상품리뷰" />
                    </ListItem>
                    <ListItem button  onClick={() => handleClickButton(3)}>
                        <ListItemIcon><img src={IconGramCreate} className="main_board_create_icon" alt=""/></ListItemIcon>
                        <ListItemText primary="기록" />
                    </ListItem>
                    <ListItem button  onClick={() => handleClickButton(4)}>
                        <ListItemIcon><img src={IconVideoCreate} className="main_board_create_icon" alt=""/></ListItemIcon>
                        <ListItemText primary="영상 기록" />
                    </ListItem>
                    <ListItem button  onClick={() => handleClickButton(5)}>
                        <ListItemIcon><img src={IconColumnCreate} className="main_board_create_icon" alt=""/></ListItemIcon>
                        <ListItemText primary="전문가 칼럼" />
                    </ListItem>
                    <ListItem button onClick={props.handleClose}>
                        <ListItemIcon className="main_board_create_icon"><Close /></ListItemIcon>
                        <ListItemText primary="닫기" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}

export default withRouter(MainBoardCreate);