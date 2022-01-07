import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserList, UserDetail } from 'components/admin/user';

const AdminUserPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/user" component={UserList}/>
      <Route exact path="/admin/user/:userId" component={UserDetail}/>
    </Switch>
  );
};

export default AdminUserPresenter;