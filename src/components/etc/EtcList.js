import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Divider, CssBaseline, Link } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import kakao_chat from 'img/kakao_chat.png'

const EtcList = (props) => {
    const [cookies, , removeCookie] = useCookies(['userKey']);
    const { enqueueSnackbar } = useSnackbar();
    const useStyles = makeStyles((theme) => ({
        root: {
          width: '100%',
          backgroundColor: '#FFFFFF',
          paddingBottom: '0px',
        },
        list: {
            height: '50px',
        },
        listIcon: {
            color: '#D5D5D5',
            fontSize: '20px',
            fontWeight: '900'
        }
    }));
    const classes = useStyles();
    const handleClickLogout = async() => {
        const data = {
            userKey: cookies.userKey
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post("/api/logout", data, config).then((response)=>{
            if(response.data.result === 1){
                removeCookie('userKey', {path: '/'});
                props.history.push('/');
                enqueueSnackbar(`정상적으로 로그아웃 되었습니다.`, { variant: 'success'});
            }
        });
    }
    const handleClickProCreate = () => {
        if(!cookies.userKey){
            enqueueSnackbar(`로그인이 필요합니다.`, 
                {   
                    variant: 'warning', 
                    action: <div className="alret_action">
                        <button 
                            onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
                        >로그인
                        </button>
                    </div>
                }
            )
            return false;
        }else{
            props.history.push('/etc/pro/create')
        }
    }
    const handleClickNotReady = () => {
        enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
    }
    const handleClickMyPage = async() => {
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.get(`/api/user/${cookies.userKey}`, config).then((response)=>{
            if(response.data){
                props.history.push(`/user/${response.data.user_no}`);
            }
        });
    }
    const handleClickQuestion = () => {
        if(cookies.userKey){
            props.history.push('/etc/question');
        }else{
            enqueueSnackbar(`로그인이 필요합니다.`, 
                {   
                    variant: 'warning', 
                    action: <div className="alret_action">
                        <button 
                            onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
                        >로그인
                        </button>
                    </div>
                }
            )
            return false;
        }
    }
    return(
        <> 
            <CssBaseline>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
                >
                { cookies.userKey ?
                <>
                <ListItem button className={classes.list} onClick={handleClickMyPage}>
                    <ListItemText primary="마이페이지"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                </>
                :null}
                <ListItem button className={classes.list} onClick={() => props.history.push('/etc/event')}>
                    <ListItemText primary="이벤트"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={() => props.history.push('/etc/notice')}>
                    <ListItemText primary="공지사항"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={() => props.history.push('/etc/faq')}>
                    <ListItemText primary="FAQ"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={handleClickQuestion}>
                    <ListItemText primary="의견 보내기" className="proApply"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={() => window.open('http://pf.kakao.com/_xlIufs/chat')}>
                    <ListItemText primary="문의하기" className="proApply" secondary={<img src={kakao_chat} />}/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={() => window.open('http://pf.kakao.com/_xlIufs/chat')}>
                    <ListItemText primary="전문가 신청" className="proApply" secondary={<img src={kakao_chat} />}/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                {/* <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={handleClickNotReady}>
                    <ListItemText primary="판매자 신청"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem> */}
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={() => props.history.push('etc/service')}>
                    <ListItemText primary="이용약관"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem button className={classes.list} onClick={() => props.history.push('/etc/privacy')}>
                    <ListItemText primary="개인정보 처리 방침"/>
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                { cookies.userKey ?
                <>
                <ListItem button className={classes.list} onClick={handleClickLogout}>
                    <ListItemText primary="로그아웃" />
                    <ChevronRight className={classes.listIcon}/>
                </ListItem>
                <Divider variant="middle"/>
                </> : null}
            </List>
            <div style={{margin:'16px 20px'}}>
                <Link onClick={() => window.open("https://www.notion.so/fitdata/9f3b6a5d50ec4827a26f0df7716aca8b")} className="etc_company">(주) 핏데이터 <ChevronRight style={{width: '10px', height: '10px', paddingTop: '2px'}}/> </Link>
            </div>
            </CssBaseline>
        </>
    );
}

export default EtcList;