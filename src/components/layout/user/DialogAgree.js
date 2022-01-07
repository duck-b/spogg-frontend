import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { withRouter } from 'react-router';
import { PowerInputSharp } from '@material-ui/icons';
import profile from 'img/main_content_half_text_profile.png';
import AgreePrivacy from './AgreePrivacy';
import AgreeService from './AgreeService';
import AgreePromotion from './AgreePromotion';

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
    color: '#000000'
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

const DialogFull = (props) => {
    const classes = useStyles();
    setTimeout(function() {
        window.onpopstate = function (event) {
            props.handleClose();
        }
    }, 100)
    const handleClickClose = () => {
        props.history.goBack();
        props.handleClose();
    }
    return (
        <Dialog fullScreen open={props.open} onClose={handleClickClose} TransitionComponent={Transition} style={{width: '100%'}}>
            <AppBar className={classes.appBar}>
            <Toolbar>
                <Grid item container alignItems="center">
                    <Grid item xs={2} style={{textAlign: 'center'}}>
                        <IconButton edge="start" onClick={handleClickClose} aria-label="close">
                            <CloseIcon className={classes.iconStyle}/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.title}>
                            {props.agree === 0 ? '이용약관' : props.agree === 1 ? '개인정보 처리 방침' : '프로모션 활동 동의'}
                        </Typography>
                    </Grid>
                </Grid>
            </Toolbar>
            </AppBar>
            <div style={{margin: '60px 0px', padding: '10px'}}>
                {props.agree === 0 ? <AgreeService /> : props.agree === 1 ? <AgreePrivacy /> : <AgreePromotion />}
            </div>
        </Dialog>
    );
}
export default withRouter(DialogFull);