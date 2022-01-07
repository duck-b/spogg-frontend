import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ShopList, ShopCreate, ShopDetail, ShopUpdate } from 'components/admin/shop';

const AdminShopPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/shop" component={ShopList}/>
      <Route exact path="/admin/shop/create" component={ShopCreate}/>
      <Route exact path="/admin/shop/:shopId" component={ShopDetail}/>
      <Route exact path="/admin/shop/:shopId/update" component={ShopUpdate}/>
    </Switch>
  );
};

export default AdminShopPresenter;