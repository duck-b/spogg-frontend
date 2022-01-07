import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'components/layout/user';
import { EtcList, EtcNotice, EtcFaq, EtcEvent, EtcQuestion, EtcPrivacy, EtcService } from 'components/etc';

const EtcPresenter = () => {
  return (
    <Layout page="etc">
      <Switch>
        <Route exact path="/etc" component={EtcList} />
        <Route path="/etc/notice" component={EtcNotice} />
        <Route path="/etc/faq" component={EtcFaq} />
        <Route path="/etc/event" component={EtcEvent} />
        <Route path="/etc/privacy" component={EtcPrivacy} />
        <Route path="/etc/service" component={EtcService} />
        <Route path="/etc/question" component={EtcQuestion} />
      </Switch>
    </Layout>
  ); 
};

export default withRouter(EtcPresenter);
