import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import {
  Header,
  ProfileImg,
  RightMenu,
  Workspaces,
  WorkspaceWrapper,
  Channels,
  WorkspaceName,
  MenuScroll,
  Chats,
} from './styles';
import gravatar from 'gravatar';
import DirectMessage from '@pages/DirectMessage';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));

// layout이기 때문에 children
// children을 사용하는 컴포넌트 type : FC
// children을 사용하지 않는 컴포넌트 type : VFC
// type error는 FC로 가져오면 됨
const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const {
    data: userData,
    error: loginError,
    revalidate: revalidateUser,
    mutate,
  } = useSWR('/api/users', fetcher, {
    // dedupingInterval안에 요청을 하면 미리 캐싱된 data를 돌려줌
    dedupingInterval: 100000,
  });

  const onLogOut = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
        // revalidateUser();
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  // 로그아웃이 되는 순간 data는 false가 되므로
  if (!userData) {
    console.log(userData);
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                프로필메뉴
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogOut}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
