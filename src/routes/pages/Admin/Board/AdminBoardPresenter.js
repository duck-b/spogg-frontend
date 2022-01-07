import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BoardList, BoardDetail } from 'components/admin/board';

const AdminBoardPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/board" component={BoardList}/>
      <Route exact path="/admin/board/:boardId" component={BoardDetail}/>
    </Switch>
  );
};

export default AdminBoardPresenter;