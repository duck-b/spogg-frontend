import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormControl, InputLabel, Input, Button, TextField, CircularProgress } from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import * as dateFns from 'date-fns';

import { useSnackbar } from 'notistack';
import axios from 'axios';

import { DialogMsg } from 'components/layout/admin';

const useStyles = makeStyles((theme) => ({
    root: {
        
    },
    paper: {
        padding: '10px'
    },
    title: {
        textAlign: 'center',
        margin: '20px',
        fontSize: '120%',
        fontWeight: 'bold'
    },
    form: {
        width: '100%',
        marginBottom: '12px',
    },
    dateForm: {
        width: '50%',
        marginBottom: '12px',
    },
    buttonGroup: {
        textAlign: 'right',
        marginTop: '10px',
        marginBottom: '10px'
    },
    buttonOption: {
        marginLeft: '5px',
        width: '50px',
    },
    buttonSwich:{
        marginRight: '0px'
    },
    buttonIcon: {
        textAlign: 'right',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    formTitle: {
        width: '100%',
        marginBottom: '12px',
        color: 'rgba(0, 0, 0, 0.54)',
        
    },
    pointer: {
        cursor: 'pointer'
    },
    hrStyle: {
        color: 'rgba(0, 0, 0, 0.42)'
    },
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
    imageTitle: {
        color: "red"
    },
    imageTitleBar: {
        background: 'none',
    },
    gridList: {
        /*flexWrap: 'nowrap',
        transform: 'translateZ(0)',*/
        width: "100%",
    },
    imageList: {
        width: "100%",
        height: "100%",
        marginRight: "2px"
    }
}));

const NoticeCreate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    
    const [values, setValues] = useState({
        title: '',
        content: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [progress, setProgress] = useState(false);

    const handleClickCreate = async() => {
        if(!values.title){
            enqueueSnackbar(`???????????? ?????? ????????? ?????????.`, { variant: 'error'});
            return false;
        }else if(!values.content){
            enqueueSnackbar(`???????????? ????????? ????????? ?????????.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const data = {
                title: values.title,
                content: values.content
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post("/api/admin/notice/create", data, config).then((response)=>{
                if(response.data.result === 1){
                    setTimeout(function(){
                        enqueueSnackbar(`????????? ?????????????????????.`, { variant: 'success'});
                        props.history.push('/admin/notice');
                    },1500);
                }else{
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            });
        }
    }
    
    const [openCancle, setOpenCancle] = useState(false);
    const handleCloseCancle = () => {
        setOpenCancle(false);
    };
    const handleClickCancle = () => {
        props.history.push('/admin/notice');
    }

    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <div  className={classes.title}>????????? ??????</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="noticeTitle">???????????? ???</InputLabel>
                            <Input
                                id="noticeTitle"
                                type="text"
                                value={values.title}
                                onChange={handleChange('title')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="noticeContent">???????????? ?????? *</InputLabel>
                            <Input
                                id="noticeContent"
                                type="text"
                                value={values.content}
                                onChange={handleChange('content')}
                                multiline
                                rows={6}
                            />
                        </FormControl>
                        
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4} className={classes.buttonGroup}>
                        {!progress ?
                        <>
                        <Button variant="contained" className={classes.buttonOption} onClick={() => setOpenCancle(true)}>
                        ??????
                        </Button>
                        <Button variant="contained" color="primary" className={classes.buttonOption} onClick={handleClickCreate}>
                        ??????
                        </Button>
                        </>
                        :                       
                        <CircularProgress />
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Grid>

        <DialogMsg 
            open={openCancle}
            title="????????? ???????????????."
            btn="??????"
            handleClick={handleClickCancle}
            handleClose={handleCloseCancle}
        >
            &nbsp;'??????' ?????? ?????? ??? ???????????? ????????? ???????????????, ????????? ????????? ???????????? ????????????.<br/>????????? ?????? ???????????? ???????????????.
        </DialogMsg>
        </>
    );
}

export default NoticeCreate;