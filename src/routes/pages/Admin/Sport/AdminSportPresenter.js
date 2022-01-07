import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SportList, SportDetail, SportUpdate } from 'components/admin/sport';

const AdminSportPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/sport" component={SportList}/>
      <Route exact path="/admin/sport/:sportId" component={SportDetail}/>
      <Route exact path="/admin/sport/:sportId/update" component={SportUpdate}/>
    </Switch>
  );
};

export default AdminSportPresenter;