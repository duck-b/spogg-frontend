import React from 'react';
import { Layout } from 'components/layout/user';
import { UserMain } from 'components/Main'

const MainPresenter = () => {
  return (
    <Layout page="main">
      <UserMain />
    </Layout>
  ); 
};

export default MainPresenter;
