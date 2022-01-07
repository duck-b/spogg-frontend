import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoticeList, NoticeCreate, NoticeUpdate, NoticeDetail } from 'components/admin/notice';

const AdminNoticePresenter = (props) => {
  return (
    <Switch>
      <Route exact path="/admin/notice" component={NoticeList}/>
      <Route exact path="/admin/notice/create" component={NoticeCreate}/>
      <Route exact path="/admin/notice/:noticeId" component={NoticeDetail}/>
      <Route exact path="/admin/notice/:noticeId/update" component={NoticeUpdate}/>
    </Switch>
  );
};

export default AdminNoticePresenter;