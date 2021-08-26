import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IChannel, IUser } from '@typings/db';
import React, { useCallback, useState, useMemo, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { Container, Header } from './styles';
import fetcher from '@utils/fetcher';
import useSocket from '@hooks/useSocket';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
  }, []);
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      {/* <ChatList /> */}
      {/* 재사용되는것들은 props로 전달 */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
    </Container>
  );
};

// props가 똑같으면 자식 리렌더링 X
export default React.memo(Channel);
