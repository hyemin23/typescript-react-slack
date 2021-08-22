import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react';
import { Container, Header } from './style';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('부모 input 서브밋');
    setChat('');
  }, []);

  return (
    <Container>
      <Header>채널</Header>
      <ChatList />
      {/* 재사용되는것들은 props로 전달 */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="asd" />
    </Container>
  );
};

export default Channel;
