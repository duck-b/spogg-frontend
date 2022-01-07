import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { EventList, EventCreate, EventUpdate } from 'components/admin/event';

const AdminEventPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/event" component={EventList}/>
      <Route exact path="/admin/event/create" component={EventCreate}/>
      <Route exact path="/admin/event/:eventId/update" component={EventUpdate}/>
    </Switch>
  );
};

export default AdminEventPresenter;