import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { GoodsList, GoodsCreate, GoodsDetail, GoodsUpdate } from 'components/admin/goods';

const AdminGoodsPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/goods" component={GoodsList}/>
      <Route exact path="/admin/goods/create" component={GoodsCreate}/>
      <Route exact path="/admin/goods/:goodsId" component={GoodsDetail}/>
      <Route exact path="/admin/goods/:goodsId/update" component={GoodsUpdate}/>
    </Switch>
  );
};

export default AdminGoodsPresenter;