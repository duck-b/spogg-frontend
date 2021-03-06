import react, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Grid, Avatar, Button, CircularProgress  } from '@material-ui/core';
import MuiSwitch from '@material-ui/core/Switch';
import MuiFormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core/styles';
import { CameraAlt } from '@material-ui/icons';
import main_content_half_text_profile from 'img/main_content_half_text_profile.png'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import imageCompression from 'browser-image-compression';


const Switch = withStyles({
    root: {
        width: '55px',
        height: '25px',
        padding: '0px',
        borderRadius: '20px',
        marginRight: '0px',
        border: '1px solid rgba(0, 0, 0, 0.12)'
    },
    switchBase: {
        color: 'rgba(0, 0, 0, 0.2)',
        padding: '1px 2px',
    },
    thumb: {
        width: '20px',
        height: '20px'
    },
    track: {
        backgroundColor: '#FFFFFF',
    },
    colorSecondary:{
        '&$checked':{
            color: '#FFFFFF',
            transform: 'translateX(30px)',
            '& + $track': {
                backgroundColor: '#5093FF',
                opacity: 1,
                border: 'none',
            },
        },
        
    },
    checked:{},
    focusVisible: {}
})(MuiSwitch);

const FormControlLabel = withStyles({
    root: {
        textAlign: 'right',
        marginRight: '0px'
    },
    checked:{},
})(MuiFormControlLabel);

const UserUpdate = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [beforeName, setBeforeName] = useState('');
    const [value, setValue] = useState({
        userPromotion: false
    });
    useEffect(() => {
        const userStatusCheck = async() => {
            const config = {
              headers: {
                  "content-type": "application/json"
              }
            };
            await axios.get(`/api/user/${cookies.userKey}/update`, config).then((response)=>{
                if(response.data.result === 1){
                    let dt = response.data.value;
                    let loadValue = {};
                    loadValue.userName = dt.user_name;
                    loadValue.userEmail = dt.user_email;
                    loadValue.userPhone = dt.user_phone ? dt.user_phone : '';
                    loadValue.userProfile = dt.user_profile;
                    loadValue.userPromotion = dt.userAgree_status === 1 ? true : false;
                    setBeforeName(dt.user_name);
                    setValue(loadValue);
                }else{
                    enqueueSnackbar(`????????? ???????????????.`, { variant: 'error'});
                    props.history.replace('/');
                }
            })
          }
            userStatusCheck();
    }, []);

    useEffect(() => {
        if(value.userPhone?.split('-').join('').length === 11){
            const changePhone = value.userPhone.split('-').join('').replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            setValue({ ...value, userPhone: changePhone });
        }
    }, [value.userPhone]);


    const [img, setImg] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const handleChangeImg = async (event) => {
        let file = event.target.files[0];	// ???????????? file??????
        
        // ????????? resize ?????? ?????? (?????? width??? 100px??? ??????)
        const options = { 
            maxSizeMB: 1, 
            maxWidthOrHeight: 120
        }
        
        try {
          const compressedFile = await imageCompression(file, options);
          setImgFile(compressedFile);
          
          // resize??? ???????????? url??? ?????? fileUrl??? ??????
          const promise = imageCompression.getDataUrlFromFile(compressedFile);
          promise.then(result => {
            setImg(result);
          })
        } catch (error) {
            console.log(error);
        }
    }
    const handleChangeValue = (event) => {
        let changeValue = {...value};
        if(event.target.id === 'userPhone'){
            const regex = /^[0-9\b-]{0,13}$/;
            if(regex.test(event.target.value)){
                changeValue[event.target.id] = event.target.value;
            }
        }else if(event.target.id !== 'userPromotion'){
            changeValue[event.target.id] = event.target.value;
            if(event.target.id === 'userName'){
                setNameError('');
            }
        }else{
            changeValue.userPromotion = !value.userPromotion;
        }
        setValue(changeValue);
    }
    const [nameError, setNameError] = useState('');
    const [updating, setUpdating] = useState(false);
    const handleClickUpdate = () => {
        setUpdating(true);
        if(beforeName === value.userName){
            UserUpdate();
        }else if(value.userName.length > 3){
            async function checkedNickName(){
                const data = {
                    nickName: value.userName,
                }
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/regist/checkId", data, config).then((response)=>{
                    if(response.data.status === 1){
                        UserUpdate();
                    }else{
                        setValue({...value, userName: ''});
                        document.getElementById('userName').focus();
                        setNameError('????????? ????????? ?????????.');
                        setUpdating(false);
                    }
                });
            }
            checkedNickName();
        }else{
            setValue({...value, userName: ''});
            document.getElementById('userName').focus();
            setNameError('4?????? ????????? ????????? ??? ????????????.');
            setUpdating(false);
        }
    }
    const UserUpdate = async() => {
        const formData = new FormData();
        formData.append('userName', value.userName);
        formData.append('userPhone', value.userPhone);
        formData.append('userPromotion', value.userPromotion);
        formData.append('imgFile', imgFile);
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        await axios.post(`/api/user/${cookies.userKey}/update`, formData, config).then((response)=>{
            if(response.data.result === 1){
                props.history.goBack();
            }else{
                enqueueSnackbar(`Error`, { variant: 'error'});
                props.history.replace('/');
            }
        });
    }
    return(
        <div className="user_form">
            <Grid item container>
                <Grid item xs={12} className="title">
                    ????????? ??????
                </Grid>
                <Grid item xs={4}>
                    <label for="imgFile">
                        <Avatar className="user_form_profile_update">
                            <CameraAlt />
                        </Avatar>
                    </label>
                    <input type="file" id="imgFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden/>
                </Grid>
                {img ?
                <Grid item xs={4}>
                    <Avatar className="user_form_profile" src={img} alt=""/>
                </Grid>:
                <Grid item xs={4}>
                    <Avatar className="user_form_profile" src={value.userProfile} alt=""/>
                </Grid>}
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={4}>
                    ?????????
                </Grid>
                <Grid item xs={8} >
                    <input type="text" placeholder="???????????? ????????? ?????????." value={value.userName} id="userName" onChange={handleChangeValue} style={{borderColor: nameError ? 'red' : ''}}/>
                    {nameError ?
                    <span className="regist_info_nickname_error">{nameError}</span>
                    :null}
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={4}>
                    ?????????
                </Grid>
                <Grid item xs={8} >
                    <input type="text" placeholder="???????????? ????????? ?????????." disabled value={value.userEmail} />
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={4}>
                    ????????????
                </Grid>
                <Grid item xs={8} >
                    <input type="text" placeholder="??????????????? ????????? ?????????." value={value.userPhone} id="userPhone" onChange={handleChangeValue} />
                </Grid>
            </Grid>
            {/* <Grid item container>
                <Grid item xs={12}>
                    ????????? ??????
                </Grid>
                <Grid item xs={12} >
                    <select>
                        <option>????????????</option>
                    </select>
                </Grid>
            </Grid> */}
            <Grid item container alignItems="center">
                <Grid item xs={4}>
                    ???????????? ??????
                </Grid>
                <Grid item xs={8} style={{textAlign: 'right'}}>
                    <FormControlLabel
                        control={<Switch id="userPromotion" checked={value.userPromotion} onClick={handleChangeValue} />}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} className="user_form_update_button">
                {!updating ?
                <Button  className="select_btn" onClick={handleClickUpdate}>
                    ?????? ??????
                </Button> :
                <Button  className="select_btn" disabled>
                    <CircularProgress style={{width: '30px', height: '30px'}} />
                </Button>
                }
            </Grid>
        </div>
    )
}

export default withRouter(UserUpdate);