import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { FaqList, FaqCreate, FaqUpdate } from 'components/admin/faq';

const AdminFaqPresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/faq" component={FaqList}/>
      <Route exact path="/admin/faq/create" component={FaqCreate}/>
      <Route exact path="/admin/faq/:faqId" component={FaqUpdate}/>
    </Switch>
  );
};

export default AdminFaqPresenter;