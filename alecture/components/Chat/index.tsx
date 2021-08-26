import { IDM } from '@typings/db';
import React, { useMemo, VFC } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const user = data.Sender;

  // @[hyemin](7)
  // "\"로 특수기호 무력화 escape 처리
  // +는 1개이상 ?는 0개나 1개 *가 0개이상
  // +?는 최대한 조금, +는 많이 ex) @[혜민]12](7)인 닉넴인경우
  // \d 는 숫자
  // | = OR
  // \n = new line
  // 즉, ID나 줄바꿈을 보면 decorator로 바꾼다.
  // 정규표현식에서는 대괄호,소괄호는 특수한 역할을 함
  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match: string, index: number) {
          //ID만 찾기
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            console.log(arr);
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          //  여기는 줄바꿈일 경우
          return <br key={match + index} />;
        },
      }),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

// props가 바뀌지 않는이상 리렌더링 되지 않음
export default React.memo(Chat);
