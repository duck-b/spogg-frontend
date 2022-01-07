import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormControl, InputLabel, Input, Select, InputAdornment, IconButton, Button, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogContentText, Avatar, GridList, GridListTile, GridListTileBar, CircularProgress } from '@material-ui/core';
import { AddAPhoto, Delete, Search, DeleteForever } from '@material-ui/icons'
import { useSnackbar } from 'notistack';
import DaumPostcode from "react-daum-postcode";
import axios from 'axios';

import { DialogMsg } from 'components/layout/admin'

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
        width: "100%"
    },
    imageList: {
        width: "100%",
        height: "100%",
        marginRight: "2px"
    }
}));

const ShopUpdate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [values, setValues] = useState({
        status: false,
        statusText: '정지',
        num: '',
        companyName: '',
        companyPhone: '',
        name: '',
        phone: '',
        email: '',
        kind: '',
        post: '',
        address: '',
        addressDetail: '',
        homepage: '',
        info: '',
        logo: ''
    });
    const [images, setImages] = useState([]);
    const [imagesCounter, setImagesCounter] = useState(0);
    const [progress, setProgress] = useState(false);

    useEffect(() => {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/shop/${props.match.params.shopId}/update`)){
                let response = await fetch(`/api/admin/shop/${props.match.params.shopId}/update`);
                response = await response.json();
                if(response.result === 1){
                    const updateValues = {
                        status: response.data.shop_status === 2 ? true : false,
                        statusText: response.data.shop_status === 2 ? "운영" : "정지",
                        num: response.data.shop_num,
                        companyName: response.data.shop_companyName,
                        companyPhone: response.data.shop_companyPhone,
                        name: response.data.shop_name,
                        phone: response.data.shop_phone,
                        email: response.data.shop_email,
                        kind: response.data.shop_kind,
                        post: response.data.shop_post,
                        address: response.data.shop_address,
                        addressDetail: response.data.shop_addressDetail,
                        homepage: response.data.shop_homepage,
                        info: response.data.shop_info,
                        logo: response.data.shop_logo
                    }
                    setValues(updateValues);
                    if(response.images){
                        setImages(response.images);
                        setImagesCounter(response.images.length);
                    }
                }else{
                    enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                    props.history.push('/admin/shop');
                }
            }
          }
        fetchMyAPI();
    }, []);

    useEffect(() => {
        if (values.num.replaceAll('-','').length === 10) {
            const changeNum = values.num.replaceAll('-','').replace(/(\d{3})(\d{2})(\d)/, "$1-$2-$3");
            setValues({ ...values, num: changeNum });
        }
    }, [values.num]);
    useEffect(() => {
        if (values.companyPhone.replaceAll('-','').length === 10) {
            const changePhone = values.companyPhone.replaceAll('-','').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
            setValues({ ...values, companyPhone: changePhone });
        }else if(values.companyPhone.replaceAll('-','').length === 11){
            const changePhone = values.companyPhone.replaceAll('-','').replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            setValues({ ...values, companyPhone: changePhone });
        }
    }, [values.companyPhone]);
    useEffect(() => {
        if (values.phone.replaceAll('-','').length === 11) {
            const changePhone = values.phone.replaceAll('-','').replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            setValues({ ...values, phone: changePhone });
        }
    }, [values.phone]);
    
    const handleChange = (prop) => (event) => {
        if(prop === 'num'){
            const regex =  /^[0-9\b-]{0,12}$/;
            if(regex.test(event.target.value)){
                setValues({ ...values, num: event.target.value.replaceAll('-',''), pw: event.target.value.replaceAll('-','') });
            }
        }else if(prop === 'status'){
            setValues({ ...values, status: !values.status, statusText: values.status ? '정지' : '운영'});
        }else if(prop === 'companyPhone'){
            const regex =  /^[0-9\b-]{0,13}$/;
            if(regex.test(event.target.value)){
                setValues({ ...values, companyPhone: event.target.value });
            }
        }else if(prop === 'phone'){
            const regex = /^[0-9\b-]{0,13}$/;
            if(regex.test(event.target.value)){
                setValues({ ...values, phone: event.target.value });
            }
        }else{
            setValues({ ...values, [prop]: event.target.value });
        }
    };

    const [logoBase64, setLogoBase64] = useState('');
    const [logoFile, setLogoFile] = useState(null);	//파일	
  
    const handleChangeLogo = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
            setLogoBase64(base64.toString()); // 파일 base64 상태 업데이트
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        setLogoFile(event.target.files[0]); // 파일 상태 업데이트
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
            enqueueSnackbar(`업체 사진은 10장까지 입력할 수 있습니다.`, { variant: 'error'});
        }
    }


    const handleClickCancle = () => {
        props.history.push(`/admin/shop/${props.match.params.shopId}`);
    }
    const handleClickUpdate = async() => {
        const numCheck = /(\d{3})-(\d{2})-(\d{5})/;
        const companyPhoneCheck = /(\d{3})-(\d{3,4})-(\d{4})/;
        const phoneCheck = /(\d{3})-(\d{4})-(\d{4})/;
        let imgCount;
        if(imgFile[0]){
            imgCount = imagesCounter + imgFile.length;
        }else{
            imgCount = imagesCounter;
        }
        if(!numCheck.test(values.num)){
            enqueueSnackbar(`사업자 등록번호를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.companyName){
            enqueueSnackbar(`업체 명을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!companyPhoneCheck.test(values.companyPhone)){
            enqueueSnackbar(`업체 전화번호를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.name){
            enqueueSnackbar(`판매자 명을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!phoneCheck.test(values.phone)){
            enqueueSnackbar(`판매자 전화번호를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.post || !values.address || !values.addressDetail){
            enqueueSnackbar(`주소를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.kind){
            enqueueSnackbar(`업종을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(imgCount > 10){
            enqueueSnackbar(`업체 사진은 10장까지 등록할 수 있습니다.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const formData = new FormData();
            formData.append('logo', logoFile);
            formData.append('status', values.status);
            formData.append('companyName', values.companyName);
            formData.append('companyPhone', values.companyPhone);
            formData.append('name', values.name);
            formData.append('phone', values.phone);
            formData.append('email', values.email);
            formData.append('kind', values.kind);
            formData.append('post', values.post);
            formData.append('address', values.address);
            formData.append('addressDetail', values.addressDetail);
            formData.append('homepage', values.homepage);
            formData.append('info', values.info);
            formData.append('logoName', values.logo);
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/admin/shop/${props.match.params.shopId}/update`, formData, config).then((response)=>{
                if(response.data.result){
                    imagesUpload();
                    setTimeout(function(){
                        enqueueSnackbar(`수정이 완료되었습니다.`, { variant: 'success'});
                        props.history.push(`/admin/shop/${props.match.params.shopId}`);
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
                formData.append('deleteImageNo', images[i].shopImage_no);
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/admin/shop/${props.match.params.shopId}/imgupdate`, formData, config);
        }
    }
    const [openCancle, setOpenCancle] = useState(false);
    
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
        }else{
            deleteImage[key].delete = false;
            setImagesCounter(imagesCounter + 1);
            
        }
        setImages(deleteImage);
    }
    const [openAddress, setOpenAddress] = useState(false);
    const handleClickOpenAddress = () => {
        setOpenAddress(true);
    };
    const handleCloseAddress = () => {
        setOpenAddress(false);
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        //setIsZoneCode(data.zonecode);
        //setIsAddress(fullAddress);
        setValues({ ...values, post: data.zonecode, address: fullAddress, addressDetail: "" });
        setOpenAddress(false);
    };
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <div  className={classes.title}>판매자 수정</div>
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
                            <InputLabel htmlFor="shopNum">사업자 등록번호</InputLabel>
                            <Input
                                id="shopNum"
                                type="text"
                                value={values.num}
                                disabled={true}
                                onChange={handleChange('num')}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopCompanyName">업체 명</InputLabel>
                            <Input
                                id="shopCompanyName"
                                type="text"
                                value={values.companyName}
                                onChange={handleChange('companyName')}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopCompanyPhone">업체 전화번호</InputLabel>
                            <Input
                                id="shopCompanyPhone"
                                type="text"
                                value={values.companyPhone}
                                onChange={handleChange('companyPhone')}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopName">판매자 명</InputLabel>
                            <Input
                                id="shopName"
                                type="text"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopPhone">판매자 전화번호</InputLabel>
                            <Input
                                id="shopPhone"
                                type="text"
                                value={values.phone}
                                onChange={handleChange('phone')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="shopEmail">판매자 이메일</InputLabel>
                            <Input
                                id="shopEmail"
                                type="text"
                                value={values.email}
                                onChange={handleChange('email')}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopPost">우편번호</InputLabel>
                            <Input
                                id="shopPost"
                                type="text"
                                disabled={true}
                                value={values.post}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        onClick={handleClickOpenAddress}
                                        edge="end"
                                        >
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopAddress">주소</InputLabel>
                            <Input
                                id="shopAddress"
                                type="text"
                                disabled={true}
                                value={values.address}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopAddressDetail">상세주소</InputLabel>
                            <Input
                                id="shopAddressDetail"
                                type="text"
                                value={values.addressDetail}
                                onChange={handleChange('addressDetail')}
                            />
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="shopKind">업종</InputLabel>
                            <Select
                            native
                            value={values.kind}
                            onChange={handleChange('kind')}
                            inputProps={{
                                name: 'kind',
                                id: 'shopKind',
                            }}
                            >
                            <option aria-label="None" value="" />
                            <option value={1}>용품</option>
                            <option value={2}>레슨</option>
                            <option value={3}>구장</option>
                            <option value={4}>대회</option>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="shopHomepage">홈페이지 링크</InputLabel>
                            <Input
                                id="shopHomepage"
                                type="text"
                                value={values.homepage}
                                onChange={handleChange('homepage')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <InputLabel htmlFor="shopInfo">업체 소개</InputLabel>
                            <Input
                                id="shopInfo"
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
                                    <div>업체 로고</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgLogo" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgLogo" onChange={handleChangeLogo} accept="/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                {
                                logoBase64 ?
                                <Grid xs={12}>
                                    <Avatar src={logoBase64} className={classes.large} />
                                </Grid> :
                                values.logo ?
                                <Grid xs={12}>
                                    <Avatar src={values.logo} className={classes.large} />
                                </Grid>:
                                <Grid xs={12}>
                                    <Avatar src="" className={classes.large} />
                                </Grid>
                                }
                            </Grid>
                        </FormControl>
                        <hr className={classes.hrStyle}/>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>업체 사진</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgFile" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgFile" onChange={handleChangeFile} accept="image/jpeg,image/jpg,image/png" multiple hidden/>
                                </Grid>
                                <GridList className={classes.gridList} /*cols={1.8}*/>
                                    {imgBase64.map((img, i) => (
                                    <GridListTile key={i} xs={6}>
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
                                        <img src={img.shopImage_image} className={classes.imageList} alt=""/>
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
                                        <img src={img.shopImage_image} className={classes.imageList} style={{filter: "brightness(20%)"}} alt=""/>
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
                        <Button variant="contained" className={classes.buttonOption} onClick={() => setOpenCancle(true)}>
                        취소
                        </Button>
                        <Button variant="contained" color="primary" className={classes.buttonOption} onClick={handleClickUpdate}>
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
        <Dialog
            open={openAddress}
            fullWidth={true}
            keepMounted
            onClose={handleCloseAddress}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">주소 검색</DialogTitle>
            <DialogContent style={{padding:"0px"}}>
                <DialogContentText id="alert-dialog-slide-description">
                    <DaumPostcode onComplete={handleComplete} />
                </DialogContentText>
            </DialogContent>
        </Dialog>

        <DialogMsg 
            open={openCancle}
            title="수정을 취소합니다."
            btn="확인"
            handleClick={handleClickCancle}
            handleClose={handleCloseCancle}
        >
            &nbsp;'확인' 버튼 클릭 시 판매자 수정이 취소가되며, 입력한 내용은 저장되지 않습니다.<br/>
            판매자 정보 페이지로 이동합니다.
        </DialogMsg>
        </>
    );
}

export default ShopUpdate;