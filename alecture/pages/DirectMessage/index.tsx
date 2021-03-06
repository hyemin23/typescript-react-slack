import { Container, Header } from '@pages/DirectMessage/styles';
import React, { useCallback, useEffect, useRef } from 'react';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import { useParams } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars-2';
import { Socket } from 'net';
import useSocket from '@hooks/useSocket';
import { toast } from 'react-toastify';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [socket] = useSocket(workspace);
  const [chat, onChangeChat, setChat] = useInput('');
  // 상대방 데이터
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);

  // 내 정보
  const { data: myData } = useSWR(`/api/users`, fetcher);
  // 채팅 받아오기
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize, // page수를 바꿔주는 역할

    // index : page 수 처음엔 0page 위에 올리면 1page로 됨
    // infinite는 [][] 2차원배열로 나눠짐. useSWR은 1차원
    // ex : [ [{id:1},{id:2}], [{id:3},{id:4}] ]
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

  // 인피니티 scroll을 할 때 변수 2개를 선언해주고 사용하면 좋음.
  // isEmpty : data가 다 있는지 확인
  // isReachingEnd : ex) 1페이지 : 20개, 2페이지 : 20개, 3페이지 :5개 라면,3페이지처럼 20개는 아니지만 data를 다 가져온 경우
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  // 스크롤바 컨트롤
  const scrollbarRef = useRef<Scrollbars>(null);

  // 채팅 정보 정렬
  // reverse 사용을 위한 이뮤타블 새로운 객체 생성
  // const chatSections = makeSection(chatData ? [...chatData].reverse() : []);

  // 2차원 배열을 1차원 배열로 만들기
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // 채팅 보내기
      console.log('chat', chat);
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        // optimistic UI
        // 성공하지 않아도 UI에 먼저 data를 그리는 기능
        // server를 가기전에 먼저 mutate
        //두 번째 인자 :  optimistic UI할 경우에는 shouldRevalidate : false 항상!
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            // DM객체
            id: (chatData[0][0]?.id || 0) + 1,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: myData.id,
            Receiver: userData,
            content: savedChat,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          // mutate 성공 후 스크롤 밑으로
          setChat('');
          revalidate();
          scrollbarRef.current?.scrollToBottom();
        });

        // mutate 후 채팅 등록
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })

          .then(() => {
            // 채팅 등록 후 받아오기
            revalidate();
          })
          .catch((err) => {
            console.dir(err.response?.data);
          });
      }
    },
    [chat, chatData],
  );

  // 로딩시 스크롤바 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      // 채팅 data가 존재해서 불러오는 경우
      if (chatData?.length === 1) {
        scrollbarRef.current?.scrollToBottom();
      }
    }
  }, [chatData, chat, myData, userData, workspace, id]);

  const onMessage = useCallback(
    (data: IDM) => {
      // id는 상대방 아이디
      // 내 채팅이 아닌 상대방 메세지만 mutateChat
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        mutateChat((chatData) => {
          // 가장 최신 배열에 최신으로 넣기
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            // 스크롤바를 150px위일 경우에만 스크롤바를 밑으로 자동 이동
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            } else {
              toast.success('새 메시지가 도착했습니다.', {
                onClick() {
                  scrollbarRef.current?.scrollToBottom();
                },
                closeOnClick: true,
              });
            }
          }
        });
      }
    },
    [id, myData, mutateChat],
  );

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
  }, [workspace, id]);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        ref={scrollbarRef}
        isReachingEnd={isReachingEnd}
        isEmpty={isEmpty}
        chatSections={chatSections}
        setSize={setSize}
      />
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message ${userData.nickname}`}
      />
    </Container>
  );
};

export default DirectMessage;
