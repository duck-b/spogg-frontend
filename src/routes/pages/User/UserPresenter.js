import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'components/layout/user';
import { UserRegist, UserLogin, UserProfile, UserBoard, UserSave, UserComment, UserUpdate, UserSport, UserFollow } from 'components/user';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const UserPresenter = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies('userKey');
  useEffect(() => {
    if(props.history.location.pathname === '/user/login' || props.history.location.pathname === '/user/regist'){
      if(cookies.userKey){
        props.history.replace('/');
        //enqueueSnackbar(`이미 로그인 되어있습니다.`, { variant: 'warning'});
      }
    }else{
      const url = props.history.location.pathname.split('/')[props.history.location.pathname.split('/').length-1];
      const userNo = props.history.location.pathname.split('/')[props.history.location.pathname.split('/').length-2];
      if(url === 'board' || url === 'save' || url === 'comment' || url === 'update' || url === 'sport'){
        if(!cookies.userKey){
          props.history.replace('/');
          enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
        }else{
          const userCheck = async() => {
            const config = {
              headers: {
                  "content-type": "application/json"
              }
            };
            await axios.get(`/api/userPage/${userNo}/${cookies.userKey}`, config).then((response)=>{
              if(response.data.result !== 1){
                props.history.replace('/');
                enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
              }
            })
          }
          userCheck();
        }
      }
    }
  });
  return (
    <Layout page="user">
      <Switch>
        <Route exact path="/user/regist" component={UserRegist} />
        <Route exact path="/user/login" component={UserLogin} />
        <Route exact path="/user/:userId" component={UserProfile} />
        <Route exact path="/user/:userId/board" component={UserBoard} />
        <Route exact path="/user/:userId/save" component={UserSave} />
        <Route exact path="/user/:userId/comment" component={UserComment} />
        <Route exact path="/user/:userId/update" component={UserUpdate} />
        <Route exact path="/user/:userId/sport" component={UserSport} />
        <Route exact path="/user/:userId/follow" component={UserFollow} />
      </Switch>
    </Layout>
  ); 
};

export default withRouter(UserPresenter);