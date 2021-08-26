import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC, forwardRef, RefObject, useCallback, VFC } from 'react';
import { useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;

  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  console.log('알이에프란 : ', ref);
  const onScroll = useCallback((values) => {
    // 끝에 도달하면 더이상 새로 불러올 필요 X
    if (values.scrollTop === 0 && !isReachingEnd) {
      // 과거데이터 기반으로 새로 바꾸기
      // 즉, 스크롤이 가장 위로 올라가면 페이지(사이즈) 하나 추가
      setSize((prevSize: number) => prevSize + 1).then(() => {
        // 스크롤 위치 유지
      });
      // 데이터 추가 로딩
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {/* Object.entries객체를 배열화시켜서 구조분해할당으로 받음 */}
        {/* date : date, chats */}
        {/* [] = 배열의 구조분해 할당 */}
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
