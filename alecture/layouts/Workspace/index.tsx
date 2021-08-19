import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
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
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
} from './styles';
import gravatar from 'gravatar';
import DirectMessage from '@pages/DirectMessage';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { IUser } from 'typings/db';

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
  } = useSWR<IUser | false>('/api/users', fetcher, {
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

  const onClickCreateWorkSpace = useCallback(() => {}, []);
  // 로그아웃이 되는 순간 data는 false가 되므로
  if (!userData) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span onClick={onClickUserProfile}>
              <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>

      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
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
