import { Header } from '@pages/SignUp/styles';
import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { Container } from '@pages/Channel/style';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';

const DirectMessage = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  // 상대방 데이터
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);

  // 내 정보
  const { data: myData } = useSWR(`/api/users`, fetcher);
  // 채팅 받아오기
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
  } = useSWR<IDM[]>(`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20=&page=1`, fetcher);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // 채팅 보내기
      console.log('chat', chat);
      if (chat?.trim()) {
        console.log('채팅 보내자 : ', chat.trim());
        // 채팅 등록
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })

          .then(() => {
            // 채팅 등록 후 받아오기
            revalidate();
            setChat('');
          })
          .catch((err) => {
            console.dir(err.response?.data);
          });
      }
    },
    [chat],
  );

  // 로딩중이거나 error일 경우
  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
    </Container>
  );
};

export default DirectMessage;
