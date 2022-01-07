import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles  } from '@material-ui/core/styles';
import { Toolbar, Typography, CssBaseline, useScrollTrigger, Slide, IconButton, Grid, Badge, Avatar } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faShoppingBasket, faChevronLeft, faUser, faHome } from '@fortawesome/free-solid-svg-icons'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import MainBoardCreate from './MainBoardCreate'; 
import DialogFristLogin from 'components/layout/user/DialogFristLogin';
import icon_pen from 'img/icon_pen.png'
import icon_person from 'img/icon_person.png'

const TopNavbar = (props) => {
    const { window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
    
    const useStyles = makeStyles((theme) => ({
        root:{

        },
        topNavbar: {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontSize: '20px',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))',
            position:'fixed',
            paddingLeft: '20px',
            height: '60px',
            zIndex: '1001'
        },topTitle: {
            fontWeight: '900',
            fontSize: '20px'
        },
        topIcon: {
            color: 'rgba(0, 0, 0, 0.5)',
            fontSize: '20px',
            width: '20px',
            height: '20px',
            marginLeft: '20px',
            
        },
        topIconList: {
            textAlign: 'right',
            paddingRight: '20px'
        },
        topTextDetail: {
            fontSize: '20px',
            textAlign: 'center',
            marginLeft: '-10px'
        },
        avatar: {
            width: '30px',
            height: '30px',
            marginLeft: '15px',
        }
    }));
    const classes = useStyles();
    const [cookies, setCookie, removeCookie] = useCookies('userKey');
    const [userInfo, setUserInfo] = useState({user_no: 0, user_profile: ''});
    useEffect(() => {
        const LoadUserProfile = async() => {
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.get(`/api/user/${cookies.userKey}`, config).then((response)=>{
                if(response.data){
                    setUserInfo({user_no: response.data.user_no, user_profile: response.data.user_profile});
                }else{
                    removeCookie('userKey', {path: '/'});
                }
            });
        }
        cookies.userKey && LoadUserProfile();
        if(props.history.location.state){
            if(props.history.location.state.login === 'frist' && props.history.action === 'REPLACE'){
                setFristLoginOpen(true);
            }
        }
    }, []);

    const [fristLoginOpen, setFristLoginOpen] = useState(false);
    const fristLoginClose = () => {
        setFristLoginOpen(false);
    }
    const [boardCreateOpen, setBoardCreateOpen] = useState(false);
    const handleClose = () => {
        setBoardCreateOpen(false);
    }
  return (
    <>
        { !props.detail ?
        <Slide appear={false} direction="down" in={!trigger} mountOnEnter unmountOnExit>
            <Grid item container justify="center">
                <Grid item xs={12} sm={8} md={5} lg={4} xl={3} container alignItems="center" justify="space-between" className={classes.topNavbar}>
                    <Grid item xs={6}>
                        <Typography className={classes.topTitle}>SPOGG</Typography>
                    </Grid>
                    <Grid item container xs={6} justify="flex-end" alignItems="center" className={classes.topIconList}>
                        <img src={icon_pen} className={classes.topIcon} onClick={() => setBoardCreateOpen(true)}/>
                        {!userInfo.user_no ?    
                        <img src={icon_person} className={classes.topIcon} onClick={() => props.history.push('/user/login')}/> :
                        <Avatar className={classes.avatar} src={userInfo.user_profile} onClick={() => props.history.push(`/user/${userInfo.user_no}`)}/>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Slide> :
        <Grid container justify="center">
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} container alignItems="center" className={classes.topNavbar}>
                <Grid item xs={2}>
                    <IconButton aria-label="search" color="inherit" onClick={() => props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: '20px'}}/>
                    </IconButton>
                </Grid>
                <Grid item xs={8} className={classes.topTextDetail}>
                    {props.detail}
                </Grid>
                <Grid item xs={2} style={{textAlign: 'right'}}>
                    {props.history.location.pathname !== '/user/login' && props.history.location.pathname !== '/user/regist' ?
                    <IconButton aria-label="search" color="inherit" onClick={() => props.history.push('/')}>
                        <div style={{fontSize: '10px', color: 'rgba(0, 0, 0, 0.5)'}}>Home</div>
                    </IconButton>
                    :null}
                </Grid>
            </Grid>
        </Grid>}
        <Toolbar />
        <MainBoardCreate open={boardCreateOpen} handleClose={handleClose}/>
        <DialogFristLogin open={fristLoginOpen} handleClose={fristLoginClose} setBoardCreateOpen={() => setBoardCreateOpen(true)}/>
    </>
  );
}

export default withRouter(TopNavbar);