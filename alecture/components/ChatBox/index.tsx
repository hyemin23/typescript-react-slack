import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox, EachMention } from '@components/ChatBox/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import autosize from 'autosize';
import React, { useCallback, useEffect, useRef, VFC } from 'react';
import { Mention, SuggestionDataItem } from 'react-mentions';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import gravatar from 'gravatar';

interface Props {
  chat: string;
  placeholder: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
}
const ChatBox: VFC<Props> = ({ chat, onChangeChat, onSubmitForm, placeholder }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, [textareaRef.current]);

  const onKeydownChat = useCallback(
    (e) => {
      // 태그를 직접 접근하고 싶을 때
      // Ref의 타입은 typescript에서만 적용해주면 됨.

      if (e.key == 'Enter') {
        // 줄 바꿈 처리 shift + enter 가 아닌 경우만
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  // 공통 compoentns인 chat box는 dm 채팅, channel의 채팅에 같이 사용 중. 따라서 여기서는 props로 올려줘야함 부모한테
  // 여기서 구체적인 작업을 하면 다른곳에서 재사용을 못함 즉, 나를 사용하는 쪽으로 구체적인 작업을 하게끔 올려줘야함.
  // const opSubmitForm = useCallback(() => {}, []);

  // 단 공통되는 data는 hook으로 가져와도 됨 (단, 재사용되는데 서로 다른 data는 밖으로 빼주면 됨.)
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
