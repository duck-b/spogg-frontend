import React, { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Main from './Admin';
import Login from './Login';
import User from './User'
import Shop from './Shop'
import Board from './Board'
import Sport from './Sport'
import Goods from './Goods'
import Event from './Event'
import Notice from './Notice'
import Faq from './Faq'
import './index.css';

import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { Layout } from 'components/layout/admin'

const AdminPresenter = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(['adminKey']);
  const [login, setLogin] = useState({
      id: "",
      status: ""
  });
  const [page, setPage] = useState([
    {
      title: '',
      url: ''
    },{
      title: ''
    },
  ]);
  useEffect(()=>{
    if(!cookies.adminKey && props.history.location.pathname !== '/admin/login'){
      enqueueSnackbar(`로그인이 필요합니다.`, { variant: 'warning'});
      props.history.push('/admin/login');
    }else if(cookies.adminKey && props.history.location.pathname === '/admin/login'){
      if(login.id){
        enqueueSnackbar(`이미 로그인 되어있습니다.`, { variant: 'warning'});
        props.history.push('/admin');
      }else{
        removeCookie("adminKey", {path: '/admin'});
      }
    }
  },[props]);

  useEffect(()=>{
    const nowPathName = (props.history.location.pathname).split('/');
    let newPage = [...page];
    switch(nowPathName[2]){
      case "user" :
        newPage[0].title = "회원"
        break;
      case "shop" :
        newPage[0].title = "판매자"
        break;
      case "board" :
        newPage[0].title = "게시글"
        break;
      case "goods" :
        newPage[0].title = "상품"
        break;
      case "order" :
        newPage[0].title = "주문"
        break;
      case "sport" :
        newPage[0].title = "종목"
        break;
      case "message" :
        newPage[0].title = "메세지"
        break;
      case "notice" :
        newPage[0].title = "공지사항"
        break; 
      case "faq" :
        newPage[0].title = "FAQ"
        break; 
      case "event" :
        newPage[0].title = "이벤트"
        break;    
      default :
        newPage[0].title = ""
        break;
    }
    if(nowPathName[3] === "create"){
      newPage[1].title = "등록"
    }else if(/^[0-9]*$/.test(nowPathName[3])){
      if(nowPathName[4] === "update"){
        newPage[1].title = "수정"
      }else{
        newPage[1].title = "정보"
      }
    }else{
      newPage[1].title = ""
    }
    newPage[0].url = `/admin/${nowPathName[2]}`;
    setPage(newPage);
    const handleClickLogin = async() => {
        let response = await fetch("/api/admin/login/check", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              adminCheck: cookies.adminKey
            })
        })
        let res = await response.json();
        if(res.result === 1){
          setCookie('adminKey', res.adminKey, {path: '/admin'});
          setLogin({...login, id: res.data.admin_id, status: res.data.admin_status});
        }else{
          setLogin({...login, id: '', status: ''});
          removeCookie('adminKey',{path: '/admin'});
          props.history.push("/admin/login");
        }
    }
    handleClickLogin();
  },[props.history.location.pathname]);

  const handleClickLogout = async() => {
    let response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            adminKey: cookies.adminKey
        })
    })
    let res = await response.json();
    if(res.result === 1){ 
        setLogin({...login, id: '', status: ''});
        removeCookie("adminKey", {path: '/admin'});
        enqueueSnackbar(`정상적으로 로그아웃 되었습니다.`, { variant: 'success'});
        props.history.push('/admin/login');
    }else{
        enqueueSnackbar(`ID와 Password를 확인해 주세요.`, { variant: 'error'});
    }
  }
  return (
      cookies.adminKey ?
      <Layout page={page} login={login} logout={handleClickLogout}>
        <Switch>
          <Route exact path="/admin" component={Main} />
          <Route path="/admin/user" component={User} />
          <Route path="/admin/shop" component={Shop} />
          <Route path="/admin/board" component={Board} />
          <Route path="/admin/sport" component={Sport} />
          <Route path="/admin/goods" component={Goods} />
          <Route path="/admin/notice" component={Notice} />
          <Route path="/admin/faq" component={Faq} />
          <Route path="/admin/event" component={Event} />
        </Switch>
      </Layout>
      :
      <Switch>
        <Route exact path="/admin/login" component={Login} />
      </Switch>
  );
};

export default withRouter(AdminPresenter);