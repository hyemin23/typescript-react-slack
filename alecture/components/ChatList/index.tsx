import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC, RefObject, useCallback, VFC } from 'react';
import { useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
}

const ChatList: VFC<Props> = ({ chatSections }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
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
};

export default ChatList;
