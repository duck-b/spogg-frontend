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

const FaqCreate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    
    const [values, setValues] = useState({
        name: '',
        content: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [progress, setProgress] = useState(false);

    const handleClickCreate = async() => {
        if(!values.name){
            enqueueSnackbar(`공지사항 명을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.content){
            enqueueSnackbar(`공지사항 내용을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const data = {
                name: values.name,
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
                        enqueueSnackbar(`입력이 완료되었습니다.`, { variant: 'success'});
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
                        <div  className={classes.title}>이벤트 등록</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="noticeName">공지사항 명</InputLabel>
                            <Input
                                id="noticeName"
                                type="text"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="noticeContent">공지사항 내용 *</InputLabel>
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
                        취소
                        </Button>
                        <Button variant="contained" color="primary" className={classes.buttonOption} onClick={handleClickCreate}>
                        등록
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
            title="등록을 취소합니다."
            btn="확인"
            handleClick={handleClickCancle}
            handleClose={handleCloseCancle}
        >
            &nbsp;'확인' 버튼 클릭 시 공지사항 등록이 취소가되며, 입력한 내용은 저장되지 않습니다.<br/>이벤트 목록 페이지로 이동합니다.
        </DialogMsg>
        </>
    );
}

export default FaqCreate;