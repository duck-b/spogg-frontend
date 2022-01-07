import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Main, User, Board, Goods, Etc, Admin } from './pages';
import { useSnackbar } from 'notistack';
/**
 * @title Routes
 * @description Main Router
 */
const Routes = (props) => {
  useEffect(() => {
    const unlisten = props.history.listen(() => {
        window.scrollTo(0, 0);
    });
    return () => {
        unlisten();
    };
  }, [props.history]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  window.addEventListener('scroll',e=>{
    closeSnackbar();
  });
  window.addEventListener('mousedown', e=> {
    closeSnackbar();
  })
  return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/board" component={Board} />
        <Route path="/goods" component={Goods} />
        <Route path="/etc" component={Etc} />
        <Route path="/user" component={User} />
        <Route path="/admin" component={Admin} />
      </Switch>
  );
};

export default withRouter(Routes);
