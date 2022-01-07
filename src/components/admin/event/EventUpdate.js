import React, { useEffect, useState } from 'react';
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

const EventCreate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    
    const [values, setValues] = useState({
        name: '',
        start: '',
        end: '',
        url: '',
        info: '',
        image: ''
    });
    useEffect(() => {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/event/${props.match.params.eventId}/update`)){
                let response = await fetch(`/api/admin/event/${props.match.params.eventId}/update`)
                response = await response.json();
                setValues({
                    name: response.data.event_name,
                    start: response.data.event_startDate,
                    end: response.data.event_endDate,
                    url: response.data.event_url,
                    info: response.data.event_info,
                    image: response.data.event_image
                })
            }
          }
          fetchMyAPI();
    },[]);
    const [errorMessage, setErrorMessage] = useState({
        start: false,
        end: false
    })
    
    const handleChange = (prop) => (event) => {
        console.log(event)
        const today = dateFns.format(new Date(), 'yyyy-MM-dd');
        if(prop === 'start' && event.target.value < today){
            setValues({ ...values, [prop]: '' });
            if(!errorMessage.start){
                setErrorMessage({...errorMessage, start: true});
                enqueueSnackbar(`오늘 날짜 이전일 수 없습니다.`, { variant: 'error'});
            }
            return false;
        }else if(prop === 'end' && event.target.value < values.start){
            setValues({ ...values, [prop]: '' });
            if(!errorMessage.end){
                setErrorMessage({...errorMessage, end: true});
                enqueueSnackbar(`시작 날짜 이전일 수 없습니다.`, { variant: 'error'});
            }
            return false;
        }else{
            if(prop === 'start' && values.end){
                setValues({ ...values, start: event.target.value, end: '' });
            }else{
                setValues({ ...values, [prop]: event.target.value });
            }
        }
    };

    const [progress, setProgress] = useState(false);

    const [imgBase64, setImgBase64] = useState('');
    const [imgFile, setImgFile] = useState(null);	//파일	
  
    const handleChangeImg = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
            setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        setImgFile(event.target.files[0]); // 파일 상태 업데이트
      }
    }

    
    const handleClickCreate = async() => {
        if(!values.name){
            enqueueSnackbar(`이벤트 명을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.start || !values.end){
            enqueueSnackbar(`이벤트 기간을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.name){
            enqueueSnackbar(`이벤트 내용을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.name){
            enqueueSnackbar(`이벤트 사진을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const formData = new FormData();
            formData.append('imgFile', imgFile);
            formData.append('name', values.name);
            formData.append('start', values.start);
            formData.append('end', values.end);
            formData.append('url', values.url);
            formData.append('info', values.info);
            formData.append('image', values.image);
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/admin/event/${props.match.params.eventId}/update`, formData, config).then((response)=>{
                if(response.data.result === 1){
                    setTimeout(function(){
                        enqueueSnackbar(`수정이 완료되었습니다.`, { variant: 'success'});
                        props.history.push('/admin/event');
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
        props.history.push('/admin/event');
    }

    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <div  className={classes.title}>이벤트 수정</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="eventName">이벤트 명</InputLabel>
                            <Input
                                id="eventName"
                                type="text"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </FormControl>
                        <FormControl className={classes.dateForm}>
                            <TextField
                                id="startDate"
                                label="시작일"
                                type="date"
                                value={values.start}
                                change
                                onChange={handleChange('start')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.dateForm}>
                            <TextField
                                id="endDate"
                                label="종료일"
                                type="date"
                                value={values.end}
                                disabled={values.start ? false : true}
                                onChange={handleChange('end')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="eventUrl">이벤트 URL</InputLabel>
                            <Input
                                id="eventUrl"
                                type="text"
                                value={values.url}
                                onChange={handleChange('url')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="eventInfo">이벤트 내용</InputLabel>
                            <Input
                                id="eventInfo"
                                type="text"
                                value={values.info}
                                onChange={handleChange('info')}
                                multiline
                                rows={6}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>이벤트 사진</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgImg" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgImg" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                {
                                imgBase64 ?
                                <Grid xs={12}>
                                    <img src={imgBase64} className={classes.imageList}  alt=""/>
                                </Grid> :
                                values.image ? 
                                <Grid xs={12}>
                                    <img src={values.image} className={classes.imageList}  alt=""/>
                                </Grid> :
                                null
                                }
                            </Grid>
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
                        수정
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
            title="수정을 취소합니다."
            btn="확인"
            handleClick={handleClickCancle}
            handleClose={handleCloseCancle}
        >
            &nbsp;'확인' 버튼 클릭 시 이벤트 수정이 취소가되며, 입력한 내용은 저장되지 않습니다.<br/>이벤트 목록 페이지로 이동합니다.
        </DialogMsg>
        </>
    );
}

export default EventCreate;