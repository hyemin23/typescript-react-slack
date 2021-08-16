import loadable from '@loadable/component';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// 페이지 단위로 코드스플리팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

//방법 1. workspace만 등록하고 이 안에서 switch로 분기
//방법 2. 계층 구조가 다를 경우 workspace에서 {children} 형식으로 받기
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/login" component={LogIn} />
    <Route path="/signup" component={SignUp} />
    {/* 주의 : 이 안에서 router들은 workspace를 기본 prefix로 갖는다.(계층적인 구조로) */}

    <Route path="/workspace" component={Workspace} />
  </Switch>
);

export default App;
