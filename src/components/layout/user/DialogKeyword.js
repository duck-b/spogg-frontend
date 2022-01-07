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
    const [insertKeyword, setInsertKeyword] = useState();
    const handleChangeKeyword = (event) => {
        setInsertKeyword(event.target.value.split(',').join('').split('|').join('').split(' ').join(''));
    }
    const AddKeyword = () => {
        if(insertKeyword){
            if(props.match.params.boardKind === '3'){
                props.handleClickAddKeyword(insertKeyword);
            }else{
                props.handleClickAddKeyword(insertKeyword, props.keywordBoardKey);
            }
            setInsertKeyword('');
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === "Enter" || event.key === "," || event.key === " "){
            AddKeyword();
        }
    }
    if(props.open){
        setTimeout(function(){
            window.onpopstate = function (event) {
                props.handleClose();
            }
        },100)
    }
    const handleClickClose = () => {
        props.history.goBack();
        props.handleClose();
        AddKeyword();
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
                            키워드
                        </Typography>
                    </Grid>
                </Grid>
            </Toolbar>
            </AppBar>
            <div className="dialog_keyword_body">
                <div className="dialog_keyword_input">
                    <input type="text" className="board_create_form" placeholder="키워드를 입력해 주세요." value={insertKeyword} onChange={handleChangeKeyword} onKeyPress={handleKeyPress} />
                    <button className="board_create_form" onClick={() => AddKeyword()}>입력</button>
                </div>
                <div className="dialog_keyword_content">
                    {props.children}
                </div>
            </div>
        </Dialog>
    );
}
export default withRouter(DialogFull);