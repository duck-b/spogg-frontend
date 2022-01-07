import React, { useEffect, useState } from 'react';
import logo from 'img/logo.png';
import kakao_login from 'img/kakao_login_btn.png';
import naver_login from 'img/naver_login_btn.png';
import google_login from 'img/google_login_btn.png';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import DialogAgree from 'components/layout/user/DialogAgree';


const UserLoginNaver = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const [cookies, setCookie, removeCookie] = useCookies(['userKey', 'beforePage']);
    const [logining, setLogining] = useState(false);
    const { naver } = window;
    const { Kakao } = window;
    
    const [open, setOpen] = useState(false);
    const [agree, setAgree] = useState(0);
    const handleClickAgree = (key) => {
        window.history.pushState(null, null, '');
        setAgree(key);
        setOpen(true);
    }
    const handlecloseAgree = () => {
        setOpen(false);
    }
    const Login = () => {
        Naver();
        UserProfile();
        responseGoogle();
        KakaoLogin();
        if(props.history.location.state){
            setCookie('beforePage', props.history.location.state, {path: '/'});
        }
    }

    useEffect(Login, []);
    
    const Naver = () => {
        const naverLogin = new naver.LoginWithNaverId({
            clientId: 'YxD7HKQsx5SslP1h4zau',
            callbackUrl: 'https://m.spo.gg/user/login', 
            isPopup: false,
            loginButton: {color: "green", type: 1, height: 30} ,
            callbackHandle: true
        });
        naverLogin.init();
    }
    
    const UserProfile = () => {
        !cookies.userKey && window.location.href.includes('access_token') && GetUser();
        async function GetUser () {
            const location = window.location.href.split('=')[1];
            const token = location.split('&')[0];
            let response = await fetch(`/api/login/naver/${token}`);
            response = await response.json();
            if(response.status === 3){
                enqueueSnackbar(`필수 동의가 필요합니다.`, { variant: 'error'});
                props.history.replace('/user/login');
            }else if(response.status === 2){
                enqueueSnackbar(`회원가입을 진행합니다.`, { variant: 'warning'});
                props.history.replace('/user/login');
                props.history.push({pathname: '/user/regist', state: response.data});
            }else if(response.status === 1){
                setTimeout(function(){
                    setCookie('userKey', response.userKey, {path: '/'});
                    if(!cookies.beforePage){
                        props.history.push('/');
                    }else{
                        removeCookie('beforePage', {path: '/'});
                        props.history.push(cookies.beforePage);
                    }
                },[1000])
            }
        }
    }
    const responseGoogle = async() => {
        if(props.history.location.hash.includes('google')){
            const token = props.history.location.hash.split('id_token=')[1].split('&')[0];
            setLogining(true);
            // const config = {
            //     headers: {
            //         "content-type": "application/json"
            //     }
            // };
            // const data = {
            //     googleId: response.profileObj.googleId,
            //     email: response.profileObj.email,
            //     imageUrl: response.profileObj.imageUrl
            // }
            // await axios.post(`/api/login/google`, data, config).then((response)=>{

            //     setTimeout(function(){
            //         if(response.data.status === 3){
            //             enqueueSnackbar(`필수 동의가 필요합니다.`, { variant: 'error'});
            //             props.history.replace('/user/login');
            //         }else if(response.data.status === 2){
            //             enqueueSnackbar(`회원가입을 진행합니다.`, { variant: 'warning'});
            //             props.history.replace('/user/login');
            //             props.history.push({pathname: '/user/regist', state: response.data.data});
            //         }else if(response.data.status === 1){
            //             setCookie('userKey', response.data.userKey, {path: '/'});
            //             if(!cookies.beforePage){
            //                 props.history.push('/');
            //             }else{
            //                 removeCookie('beforePage', {path: '/'});
            //                 props.history.push(cookies.beforePage);
            //             }    
            //         }
            //     },[1000])
            // });
            let response = await fetch(`/api/login/google/${token}`);
            response = await response.json();
            setTimeout(function(){
                if(response.status === 3){
                    enqueueSnackbar(`필수 동의가 필요합니다.`, { variant: 'error'});
                    props.history.replace('/user/login');
                }else if(response.status === 2){
                    enqueueSnackbar(`회원가입을 진행합니다.`, { variant: 'warning'});
                    props.history.replace('/user/login');
                    props.history.push({pathname: '/user/regist', state: response.data});
                }else if(response.status === 1){
                    setCookie('userKey', response.userKey, {path: '/'});
                    if(!cookies.beforePage){
                        props.history.push('/');
                    }else{
                        removeCookie('beforePage', {path: '/'});
                        props.history.push(cookies.beforePage);
                    }    
                }
            },[1000])
        }
    }

    const handleClickNaver = () => {
        if(document && document?.querySelector("#naverIdLogin")?.firstChild && window !== undefined){
            const loginBtn = document.getElementById("naverIdLogin")?.firstChild;
            loginBtn.click();
        }
    }
    const handleClickGoogle = () => {
        if(document && document?.querySelector("#googleIdLogin")?.firstChild && window !== undefined){
            const loginBtn = document.getElementById("googleIdLogin")?.firstChild;
            loginBtn.click();
        }
    }
    // const responseKakao = async(kakaoUser) => {
    //     console.log(kakaoUser)
    //     if(kakaoUser){
    //         const config = {
    //             headers: {
    //                 "content-type": "application/json"
    //             }
    //         };
    //         const data = {
    //             kakaoId: kakaoUser.id,
    //             email: kakaoUser.kakao_account.email,
    //             imageUrl: kakaoUser.profile.thumbnail_image_url
    //         }
    //         setLogining(true);
    //         await axios.post(`/api/login/kakao`, data, config).then((response)=>{
    //             setTimeout(function(){
    //                 if(response.status === 3){
    //                     enqueueSnackbar(`필수 동의가 필요합니다.`, { variant: 'error'});
    //                     props.history.replace('/user/login');
    //                 }else if(response.status === 2){
    //                     enqueueSnackbar(`회원가입을 진행합니다.`, { variant: 'warning'});
    //                     props.history.replace('/user/login');
    //                     props.history.push({pathname: '/user/regist', state: response.data});
    //                 }else if(response.status === 1){
    //                     setCookie('userKey', response.userKey, {path: '/'});
    //                     if(!cookies.beforePage){
    //                         props.history.push('/');
    //                     }else{
    //                         removeCookie('beforePage', {path: '/'});
    //                         props.history.push(cookies.beforePage);
    //                     }    
    //                 }
    //             },[1000])
    //         }) 
    //     }
    // }
    const responseKakao = async(kakaoUser) => {
        if(kakaoUser){
            const token = kakaoUser.access_token;
            setLogining(true);
            let response = await fetch(`/api/login/kakao/${token}`);
            response = await response.json();
            setTimeout(function(){
                if(response.status === 3){
                    enqueueSnackbar(`필수 동의가 필요합니다.`, { variant: 'error'});
                    props.history.replace('/user/login');
                }else if(response.status === 2){
                    enqueueSnackbar(`회원가입을 진행합니다.`, { variant: 'warning'});
                    props.history.replace('/user/login');
                    props.history.push({pathname: '/user/regist', state: response.data});
                }else if(response.status === 1){
                    setCookie('userKey', response.userKey, {path: '/'});
                    if(!cookies.beforePage){
                        props.history.push('/');
                    }else{
                        removeCookie('beforePage', {path: '/'});
                        props.history.push(cookies.beforePage);
                    }    
                }
            },[1000])
        }else{
            console.log('error')
        }
    }
    // const handleClickKakao = () => {
    //     // 창 그대로
    //     Kakao.Auth.login({
    //         success: function(response){
    //             responseKakao(response);
    //         },
    //         fail: function(error){
    //             enqueueSnackbar(`관리자에게 문의해주세요.`, { variant: 'error'});
    //         }
    //     })
    // }
    const KakaoLogin = () => {
        !cookies.userKey && window.location.href.includes('code') && GetUser();
        async function GetUser () {
            const token = window.location.href.split('=')[1];
            const body = {
                grant_type: "authorization_code",
                client_id: 'bb6794e7f86666f31143d5a04a962694',
                redirect_uri: "https://m.spo.gg/user/login",
                code: token
            }
            const queryStringBody = Object.keys(body)
            .map(k => encodeURIComponent(k) + "=" + encodeURI(body[k]))
            .join("&")
            fetch("https://kauth.kakao.com/oauth/token",{
                method: "POST",
                headers: {
                'content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
                },
                body : queryStringBody
            })
            .then(res => res.json())
            .then((data) => {
                responseKakao(data);
                // Kakao.Auth.setAccessToken(data.access_token);
                // Kakao.API.request({
                //     url: '/v2/user/me',
                //     success: function(res){
                //         console.log(res)
                //         responseKakao(res);
                //     },
                //     fail: function(error){
                //         enqueueSnackbar(`관리자에게 문의해주세요.`, { variant: 'error'});
                //     }
                // })
            })
        }
    }
    // const handleClickKakao = () => {
    //     Kakao.Auth.login({
    //         success: function(response){
    //             responseKakao(response);
    //         },
    //         fail: function(error){
    //             enqueueSnackbar(`관리자에게 문의해주세요.`, { variant: 'error'});
    //         }
    //     })
    // }
    const handleClickKakao = () => {
        Kakao.Auth.authorize({
            redirectUri: 'https://m.spo.gg/user/login'
        });
    }
    
    const handleClickLogin = async() => {
        if(window.location.search === '?adminlogin'){
            let response = await fetch(`/api/login/admin`);
            response = await response.json();
            setCookie('userKey', response.userKey, {path: '/'});
            props.history.push('/');
        }else{
            enqueueSnackbar(`Password Error`, { variant: 'Error'});
        }
    }

    const handleClickNotReady = () => {
        enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
    }

    const handleClickLoginNotReady = () => {
        enqueueSnackbar(`준비중 입니다. 네이버 또는 Google 로그인을 이용해주세요.`, {variant: 'warning'});
    } 

    return(
        <>
        <div id="naverIdLogin" style={{display: 'none'}}></div>
        <div id="googleIdLogin" style={{display: 'none'}}>
            <GoogleLogin 
                clientId="758180950975-qf2hd13t95g8v6me465ren4bmudn4vod.apps.googleusercontent.com"
                buttonText="GoogleLogin"
                // onSuccess={responseGoogle}
                // onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                uxMode='redirect'
                redirectUri='https://m.spo.gg/user/login'
                isSignedIn={true}
            />
        </div>
        
        {!props.history.location.hash && !logining ?
        <div>
            <Grid item container alignItems="center" justify="center" className="login_logo" >
                <Grid item xs={5} alignContent="center">
                    <img src={logo} className="login_logo"/>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" justify="center" className="login_comment" >
                <Grid item xs={8}>
                    <p>SNS 계정으로 간편 로그인/회원가입</p>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" justify="center" className="login_button_group" >
                <Grid item xs={10}>
                    <img src={naver_login} alt="" onClick={handleClickNaver} className="login_button" />
                </Grid>
                <Grid item xs={10}>
                    <img src={kakao_login} alt="" onClick={handleClickKakao} className="login_button" />
                </Grid>
                <Grid item xs={10}>
                    <img src={google_login} alt="" onClick={handleClickGoogle} className="login_button" />
                </Grid>
            </Grid>
            <ul className="login_info">
                <li onClick={() => window.open('http://pf.kakao.com/_xlIufs/chat')}>전문가 신청</li>
                <li onClick={() => props.history.replace('/', {login: 'frist'})}>판매자 신청</li>
                <li onClick={() => handleClickAgree(0)}>이용약관</li>
                <li onClick={() => handleClickAgree(1)}>개인정보 처리 방침</li>
                {window.location.origin === 'http://localhost:3000'?
                <li onClick={handleClickLogin}>관리자</li>:
                null}
            </ul>
        </div>:
        <div style={{paddingTop: '40vh', textAlign: 'center'}}>
            <CircularProgress />
        </div>}
        <DialogAgree 
            open={open}
            handleClose={handlecloseAgree}
            agree={agree}
        />
        </>
    );
}

export default UserLoginNaver;