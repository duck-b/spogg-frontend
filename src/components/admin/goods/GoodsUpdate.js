import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormControl, InputLabel, Input, Select, InputAdornment, IconButton, Button, FormControlLabel, Switch, GridList, GridListTile, GridListTileBar, TextField, CircularProgress, Chip } from '@material-ui/core';
import { AddAPhoto, Delete, DeleteForever, AddCircle } from '@material-ui/icons'

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
    },
    keyword : {
        marginRight: "5px",
        marginBottom: "10px"
    },
}));

const GoodsUpdate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    
    const [values, setValues] = useState({
        status: false,
        statusText: '??????',
        name: '',
        kind: '',
        sport: '',
        manufacturer: '',
        fixHashtag: '',
        releasePrice: '',
        releaseDate: '',
        url: '',
        info: '',
        keyword: ''
    });
    
    const handleChange = (prop) => (event) => {
        if(prop === 'status'){
            setValues({ ...values, status: !values.status, statusText: values.status ? '??????' : '??????'});
        }else{
            setValues({ ...values, [prop]: event.target.value });
        }
    };
    const [sport, setSport] = useState([]);
    const [firstImage, setFirstImage] = useState('');
    const [images, setImages] = useState([]);
    const [imagesCounter, setImagesCounter] = useState(0);
    const [fixHashtag, setFixHashtage] = useState();
    const [keyword, setKeyword] = useState([]);
    const [deleteKeyword, setDeleteKeyword] = useState([]);
    const [deleteNo, setDeleteNo] = useState([]);
    useEffect(() => {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/goods/${props.match.params.goodsId}/update`)){
                let response = await fetch(`/api/admin/goods/${props.match.params.goodsId}/update`)
                response = await response.json();
                setSport(response.sport);
                let firstImage;
                let loadFixHashtag = [];
                let addImage = [];
                let addKeyword = [];
                if(response.goodsDetail.length){
                    const goodsDetail = response.goodsDetail;
                    for(let i = 0; i < goodsDetail.length; i++){
                        if(goodsDetail[i].goodsDetail_kind === 1){
                            firstImage = goodsDetail[i].goodsDetail_value;
                        }else if(goodsDetail[i].goodsDetail_kind === 2){
                            loadFixHashtag = goodsDetail[i].goodsDetail_value;
                        }else if(goodsDetail[i].goodsDetail_kind === 3){
                            addImage.push({url: goodsDetail[i].goodsDetail_value, no: goodsDetail[i].goodsDetail_no, delete: false})
                        }else if(goodsDetail[i].goodsDetail_kind === 4){
                            addKeyword.push({txt: goodsDetail[i].goodsDetail_value, no: goodsDetail[i].goodsDetail_no, delete: false})
                        }
                        setFirstImage(firstImage);
                        setFixHashtage(loadFixHashtag);
                        setImages(addImage);
                        setDeleteKeyword(addKeyword);
                    }
                }
                setValues({
                    status: response.goods.goods_status === 2 ? true : false,
                    statusText: response.goods.goods_status === 2 ? '??????' : '??????',
                    name: response.goods.goods_name,
                    kind: response.goods.goods_kind,
                    sport: response.goods.goods_sport,
                    manufacturer: response.goods.goods_manufacturer,
                    fixHashtag: loadFixHashtag,
                    releasePrice: response.goods.goods_releasePrice,
                    releaseDate: response.goods.goods_releaseDate,
                    url: response.goods.goods_url,
                    info: response.goods.goods_info,
                })
            }
          }
          fetchMyAPI();
    },[]);
    const handleChangeKeyword = (event) => {
        setValues({...values, keyword: event.target.value});
    }
    const handleClickKeyword = () => {
        if(values.keyword){
            const updateKeyword = [...keyword];
            updateKeyword.push(values.keyword);
            setKeyword(updateKeyword);
            setValues({...values, keyword: ''});
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === "Enter"){
            handleClickKeyword();
        }
    }
    const handleClickDeleteKeyword = (i) => {
        let deleteWord = [...deleteKeyword];
        deleteWord[i].delete = true;
        let addDeleteNo = [...deleteNo];
        addDeleteNo.push(deleteWord[i].no);
        setDeleteKeyword(deleteWord);
        setDeleteNo(addDeleteNo);
    }
    const handleClickRemoveKeyword = (i) => {
        const removeKeyword = [...keyword];
        removeKeyword.splice(i, 1);
        setKeyword(removeKeyword);
    }

    const [progress, setProgress] = useState(false);

    const [firstBase64, setFirstBase64] = useState('');
    const [firstFile, setFirstFile] = useState(null);	//??????	
  
    const handleChangeFirst = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. ????????? ???????????? ??????????????? ???????????????.
        const base64 = reader.result;
        if (base64) {
            setFirstBase64(base64.toString()); // ?????? base64 ?????? ????????????
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. ????????? ?????? ????????? ???????????????.
        setFirstFile(event.target.files[0]); // ?????? ?????? ????????????
      }
    }

    const [imgBase64, setImgBase64] = useState([]);
    const [imgFile, setImgFile] = useState([null]);	//??????	

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
                    reader.readAsDataURL(fileArr[i]); // 1. ????????? ?????? ????????? ???????????????.
                    addImagesFiles[i + imgCount] = fileArr[i];
                    setImgFile(addImagesFiles); // ?????? base64 ?????? ????????????
                }
            }
        }else{
            enqueueSnackbar(`?????? ????????? 10????????? ????????? ??? ????????????.`, { variant: 'error'});
        }
    }
    
    const handleClickCancle = () => {
        props.history.push('/admin/goods');
    }
    const handleClickCreate = async() => {
        let imgCount;
        if(imgFile[0]){
            imgCount = imagesCounter + imgFile.length;
        }else{
            imgCount = imagesCounter;
        }
        if(!values.kind){
            enqueueSnackbar(`???????????? ????????? ?????????.`, { variant: 'error'});
            return false;
        }else if(!values.sport){
            enqueueSnackbar(`???????????? ????????? ?????????.`, { variant: 'error'});
            return false;
        }else if(!values.name){
            enqueueSnackbar(`?????? ?????? ????????? ?????????.`, { variant: 'error'});
            return false;
        }else if(imgCount > 10){
            enqueueSnackbar(`?????? ????????? 10????????? ????????? ??? ????????????.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const formData = new FormData();
            formData.append('firstImage', firstFile);
            formData.append('beforeImage', firstImage);
            formData.append('status', values.status);
            formData.append('name', values.name);
            formData.append('kind', values.kind);
            formData.append('sport', values.sport);
            formData.append('manufacturer', values.manufacturer);
            formData.append('fixHashtag', values.fixHashtag);
            formData.append('beforeHashtag', fixHashtag);
            if(keyword.length){
                for(let i = 0; i < keyword.length; i++){
                    formData.append('hashtag[]', keyword[i]);
                }
            }else{
                formData.append('hashtag', '');
            }
            if(deleteNo.length){
                for(let i = 0; i < deleteNo.length; i++){
                    formData.append('deleteHashtage[]', deleteNo[i]);
                }
            }else{
                formData.append('deleteHashtage', '');
            }
            formData.append('releaseDate', values.releaseDate);
            formData.append('releasePrice', values.releasePrice);
            formData.append('url', values.url);
            formData.append('info', values.info);
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/admin/goods/${props.match.params.goodsId}/update`, formData, config).then((response)=>{
                if(response.data.goods_no){
                    imagesUpload();
                    setTimeout(function(){
                        enqueueSnackbar(`????????? ?????????????????????.`, { variant: 'success'});
                        props.history.push(`/admin/goods/${props.match.params.goodsId}`);
                    },1500);
                }else{
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            });
        }
    }
    const imagesUpload = async() => {
        if(imgFile[0] || images[0]){
            const formData = new FormData();
            for(let i = 0; i < imgFile.length; i++){
                formData.append('images', imgFile[i]);
            }
            for(let i = 0; i < images.length; i++){
                formData.append('deleteImage', images[i].delete);
                formData.append('deleteDetailNo', images[i].no);
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/admin/goods/${props.match.params.goodsId}/imgupdate`, formData, config);
        }
    }
    const [openCancle, setOpenCancle] = useState(false);
    const handleClickOpenCancle = () => {
        setOpenCancle(true);
    };
    const handleCloseCancle = () => {
        setOpenCancle(false);
    };

    const handleClickImageRemove = (key) => {
        const removeImageURL = [...imgBase64];
        removeImageURL.splice(key, 1);
        setImgBase64(removeImageURL);
        const removeImageFile = [...imgFile];
        removeImageFile.splice(key, 1);
        setImgFile(removeImageFile);
    }
    const handleClickImageDelete = (key) => {
        let deleteImage = [...images];
        if(!deleteImage[key].delete){
            deleteImage[key].delete = true;
            setImagesCounter(imagesCounter - 1);
            console.log(deleteImage)
        }else{
            deleteImage[key].delete = false;
            setImagesCounter(imagesCounter + 1);
            
        }
        setImages(deleteImage);
    }
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <div  className={classes.title}>?????? ??????</div>
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
                            <InputLabel htmlFor="goodsKind">?????????</InputLabel>
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
                                <option value={1}>??????</option>
                                <option value={2}>??????</option>
                                <option value={3}>??????</option>
                                <option value={4}>??????</option>
                            </Select>
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="goodsSport">?????????</InputLabel>
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
                                <optgroup label="?????? / ??????">
                                    {sport.map((sport)=>(sport.sport_kind === 1 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                                <optgroup label="?????? / ????????????">
                                    {sport.map((sport)=>(sport.sport_kind === 2 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                                <optgroup label="?????? / ????????????">
                                    {sport.map((sport)=>(sport.sport_kind === 3 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                                <optgroup label="??????">
                                    {sport.map((sport)=>(sport.sport_kind === 4 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                                </optgroup>
                            </Select>
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="goodsName">?????? ???</InputLabel>
                            <Input
                                id="goodsName"
                                type="text"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsManufacturer">?????????</InputLabel>
                            <Input
                                id="goodsManufacturer"
                                type="text"
                                value={values.manufacturer}
                                onChange={handleChange('manufacturer')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsFixHashtag">?????? ????????????</InputLabel>
                            <Input
                                id="goodsFixHashtag"
                                type="text"
                                value={values.fixHashtag}
                                onChange={handleChange('fixHashtag')}
                                startAdornment={<InputAdornment position="start">#</InputAdornment>}
                            />
                        </FormControl>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword">?????? ??????</InputLabel>
                                <Input
                                    id="keyword"
                                    type="text"
                                    value={values.keyword}
                                    onChange={handleChangeKeyword}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickKeyword}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.map((keyword, i) => (
                            !keyword.delete?
                            <Chip label={`# ${keyword.txt}`} onDelete={() => handleClickDeleteKeyword(i)} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i)} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <FormControl className={classes.form}>
                            
                            <TextField
                                id="goodsReleaseDate"
                                label="?????????"
                                type="date"
                                value={values.releaseDate}
                                onChange={handleChange('releaseDate')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsReleasePrice">?????????</InputLabel>
                            <Input
                                id="goodsReleasePrice"
                                type="text"
                                value={values.releasePrice}
                                onChange={handleChange('releasePrice')}
                                endAdornment={<InputAdornment position="end">???</InputAdornment>}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsUrl">?????? URL</InputLabel>
                            <Input
                                id="goodsUrl"
                                type="text"
                                value={values.url}
                                onChange={handleChange('url')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="goodsInfo">??????</InputLabel>
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
                                    <div>?????? ??????</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgFirst" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgFirst" onChange={handleChangeFirst} accept="image/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                {
                                firstBase64 ?
                                <Grid xs={12}>
                                    <img src={firstBase64} className={classes.imageList} alt=""/>
                                </Grid> :
                                    firstImage ?
                                <Grid xs={12}>
                                    <img src={firstImage} className={classes.imageList} alt=""/>
                                </Grid> :
                                null
                                }
                            </Grid>
                        </FormControl>
                        <hr className={classes.hrStyle}/>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>?????? ??????</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgFile" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgFile" onChange={handleChangeFile} accept="image/jpeg,image/jpg,image/png" multiple hidden/>
                                </Grid>
                                <GridList className={classes.gridList} /*cols={1}*/ >
                                    {imgBase64.map((img, i) => (
                                    <GridListTile key={i} xs={12}>
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
                                    {images.map((img, i) => (
                                        !img.delete ?
                                    <GridListTile key={i} xs={6}>
                                        <img src={img.url} className={classes.imageList} alt="" />
                                        <GridListTileBar
                                        classes={{
                                            root: classes.imageTitleBar,  
                                        }}
                                        actionIcon={
                                            <IconButton>
                                                <Delete className={classes.imageTitle} onClick={() => handleClickImageDelete(i)} />
                                            </IconButton>
                                        }
                                        />
                                    </GridListTile>
                                        :
                                    <GridListTile key={i} xs={6}>
                                        <img src={img.url} className={classes.imageList} style={{filter: "brightness(20%)"}} alt=""/>
                                        <GridListTileBar
                                        classes={{
                                            root: classes.imageTitleBar,  
                                        }}
                                        actionIcon={
                                            <IconButton>
                                                <DeleteForever className={classes.imageTitle} onClick={() => handleClickImageDelete(i)} />
                                            </IconButton>
                                        }
                                        />
                                    </GridListTile>    
                                    ))}
                                </GridList>
                            </Grid>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4} className={classes.buttonGroup}>
                        {!progress ?
                        <>
                        <Button variant="contained" className={classes.buttonOption} onClick={handleClickOpenCancle}>
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
            &nbsp;'??????' ?????? ?????? ??? ?????? ????????? ???????????????, ????????? ????????? ???????????? ????????????.<br/>?????? ?????? ???????????? ???????????????.
        </DialogMsg>
        </>
    );
}

export default GoodsUpdate;