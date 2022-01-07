import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'components/layout/user';
import { BoardKind, BoardList, BoardCreate, BoardDetail, BoardUpdate } from 'components/board';


const BoardPresenter = () => {
  return (
    <Layout page="board">
      <Switch>
        <Route exact path="/board" component={BoardKind} />
        <Route exact path="/board/:boardKind" component={BoardList} />
        <Route exact path="/board/:boardKind/create" component={BoardCreate} />
        <Route exact path="/board/:boardKind/:boardId" component={BoardDetail} />
        <Route exact path="/board/:boardKind/:boardId/update" component={BoardUpdate} />
      </Switch>
    </Layout>
  ); 
};

export default withRouter(BoardPresenter);
