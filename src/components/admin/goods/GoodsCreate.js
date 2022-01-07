import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormControl, InputLabel, Input, Select, InputAdornment, IconButton, Button, FormControlLabel, Switch, GridList, GridListTile, GridListTileBar, TextField, CircularProgress } from '@material-ui/core';
import { AddAPhoto, Delete } from '@material-ui/icons'

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

const GoodsCreate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    
    const [values, setValues] = useState({
        status: false,
        statusText: '정지',
        name: '',
        kind: '',
        sport: '',
        manufacturer: '',
        fixHashtag: '',
        releasePrice: null,
        releaseDate: '',
        url: '',
        info: '',
    });
    
    const handleChange = (prop) => (event) => {
        if(prop === 'status'){
            setValues({ ...values, status: !values.status, statusText: values.status ? '정지' : '판매'});
        }else{
            setValues({ ...values, [prop]: event.target.value });
        }
    };
    const [sport, setSport] = useState([]);
    useEffect(() => {
        async function fetchMyAPI(){
            if(await fetch('/api/admin/goods/create')){
              let response = await fetch('/api/admin/goods/create')
              response = await response.json();
              setSport(response);
            }
          }
          fetchMyAPI();
    },[]);

    const [progress, setProgress] = useState(false);

    const [firstBase64, setFirstBase64] = useState('');
    const [firstFile, setFirstFile] = useState(null);	//파일	
  
    const handleChangeFirst = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
            setFirstBase64(base64.toString()); // 파일 base64 상태 업데이트
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        setFirstFile(event.target.files[0]); // 파일 상태 업데이트
      }
    }

    const [imgBase64, setImgBase64] = useState([]);
    const [imgFile, setImgFile] = useState([null]);	//파일	

    const handleChangeFile = (event) => {
        if(event.target.files.length + imgBase64.length <= 10){    
            const fileArr = event.target.files;
            const imgCount = imgBase64.length;
            let fileURLs = [...imgBase64];
            let addImagesFiles = [...imgFile];
            for(let i = 0; i < fileArr.length; i++){

                let reader = new FileReader();
                reader.onload = () => {
                    fileURLs[i + imgCount] = reader.result.toString();
                    setImgBase64([...fileURLs]);
                };
                if (fileArr[i]) {
                    reader.readAsDataURL(fileArr[i]); // 1. 파일을 읽어 버퍼에 저장합니다.
                    addImagesFiles[i + imgCount] = fileArr[i];
                    setImgFile(addImagesFiles); // 파일 base64 상태 업데이트
                }
            }
        }else{
            enqueueSnackbar(`상품 사진은 10장까지 등록할 수 있습니다.`, { variant: 'error'});
        }
    }
    
    const handleClickCreate = async() => {
        if(!values.kind){
            enqueueSnackbar(`대분류를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.sport){
            enqueueSnackbar(`소분류를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.name){
            enqueueSnackbar(`상품 명을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const formData = new FormData();
            formData.append('firstImage', firstFile);
            formData.append('status', values.status);
            formData.append('name', values.name);
            formData.append('kind', values.kind);
            formData.append('sport', values.sport);
            formData.append('manufacturer', values.manufacturer);
            formData.append('fixHashtag', values.fixHashtag);
            formData.append('releaseDate', values.releaseDate);
            formData.append('releasePrice', values.releasePrice);
            formData.append('url', values.url);
            formData.append('info', values.info);
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post("/api/admin/goods/create", formData, config).then((response)=>{
                if(response.data.goods_no){
                    imagesUpload(response.data.goods_no);
                    setTimeout(function(){
                        enqueueSnackbar(`입력이 완료되었습니다.`, { variant: 'success'});
                        props.history.push('/admin/goods');
                    },1500);
                }else{
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            });
        }
    }
    const imagesUpload = async(goods_no) => {
        if(imgFile.length > 0){
            const formData = new FormData();
            formData.append('goods_no', goods_no);
            for(let i = 0; i < imgFile.length; i++){
                formData.append('images', imgFile[i]);
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post("/api/admin/goods/imgupload", formData, config).then((response)=>{
                
            });
        }
    }
    const [openCancle, setOpenCancle] = useState(false);
    const handleCloseCancle = () => {
        setOpenCancle(false);
    };
    const handleClickCancle = () => {
        props.history.push('/admin/goods');
    }

    const handleClickImageRemove = (key) => {
        const removeImageURL = [...imgBase64];
        removeImageURL.splice(key, 1);
        setImgBase64(removeImageURL);
        const removeImageFile = [...imgFile];
        removeImageFile.splice(key, 1);
        setImgFile(removeImageFile);
    }

    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <div  className={classes.title}>상품 등록</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4} className={classes.buttonGroup}>
                       <FormControlLabel
                            className={classes.buttonSwich}
                            control={
                            <Switch
                                checked={values.status}
                                onChange={handleChange('status')}
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label={values.statusText}
                        />
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="goodsKind">대분류</InputLabel>
                            <Select
                                native
                                value={values.kind}
                                onChange={handleChange('kind')}
                                inputProps={{
                                    name: 'kind',
                                    id: 'goodsKind',
                                }}
                            >
                                <option aria-label="None" value="" />
                                <option value={1}>용품</option>
                                <option value={2}>레슨</option>
                                <option value={3}>구장</option>
                                <option value={4}>대회</option>
                            </Select>
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="goodsSport">소분류</InputLabel>
                            <Select
                                native
                                value={values.sport}
                                onChange={handleChange('sport')}
                                inputProps={{
                                    name: 'sport',
                                    id: 'goodsSport',
                                }}
                            >
                                <option aria-label="None" value="" />
                                <optgroup label="구기 / 라켓">
                                    {sport.map((sport)=>(sport.sport_kind === 1 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                                <optgroup label="헬스 / 피트니스">
                                    {sport.map((sport)=>(sport.sport_kind === 2 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                                <optgroup label="레저 / 생활체육">
                                    {sport.map((sport)=>(sport.sport_kind === 3 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                                <optgroup label="기타">
                                    {sport.map((sport)=>(sport.sport_kind === 4 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                            </Select>
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="goodsName">상품 명</InputLabel>
                            <Input
                                id="goodsName"
                                type="text"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsManufacturer">제조사</InputLabel>
                            <Input
                                id="goodsManufacturer"
                                type="text"
                                value={values.manufacturer}
                                onChange={handleChange('manufacturer')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsFixHashtag">고정 해시태그</InputLabel>
                            <Input
                                id="goodsFixHashtag"
                                type="text"
                                value={values.fixHashtag}
                                onChange={handleChange('fixHashtag')}
                                startAdornment={<InputAdornment position="start">#</InputAdornment>}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            
                            <TextField
                                id="goodsReleaseDate"
                                label="출시일"
                                type="date"
                                value={values.releaseDate}
                                onChange={handleChange('releaseDate')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsReleasePrice">출시가</InputLabel>
                            <Input
                                id="goodsReleasePrice"
                                type="text"
                                value={values.releasePrice}
                                onChange={handleChange('releasePrice')}
                                endAdornment={<InputAdornment position="end">원</InputAdornment>}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsUrl">상품 URL</InputLabel>
                            <Input
                                id="goodsUrl"
                                type="text"
                                value={values.url}
                                onChange={handleChange('url')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsInfo">내용</InputLabel>
                            <Input
                                id="goodsInfo"
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
                                    <div>대표 사진</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgFirst" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgFirst" onChange={handleChangeFirst} accept="image/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                {
                                firstBase64 ?
                                <Grid xs={12}>
                                    <img src={firstBase64} className={classes.imageList}  alt=""/>
                                </Grid> :
                                null
                                }
                            </Grid>
                        </FormControl>
                        <hr className={classes.hrStyle}/>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>상품 사진</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgFile" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgFile" onChange={handleChangeFile} accept="image/jpeg,image/jpg,image/png" multiple hidden/>
                                </Grid>
                                {
                                imgBase64 ?
                                <GridList className={classes.gridList} /*cols={1}*/ >
                                    {imgBase64.map((img, i) => (
                                    <GridListTile xs={12}>
                                        <img src={img} className={classes.imageList} alt=""/>
                                        <GridListTileBar
                                        classes={{
                                            root: classes.imageTitleBar,  
                                        }}
                                        actionIcon={
                                            <IconButton>
                                                <Delete className={classes.imageTitle} onClick={() => handleClickImageRemove(i)} />
                                            </IconButton>
                                        }
                                        />
                                    </GridListTile>
                                    ))}
                                </GridList>
                                :
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
            &nbsp;'확인' 버튼 클릭 시 상품 등록이 취소가되며, 입력한 내용은 저장되지 않습니다.<br/>상품 목록 페이지로 이동합니다.
        </DialogMsg>
        </>
    );
}

export default GoodsCreate;