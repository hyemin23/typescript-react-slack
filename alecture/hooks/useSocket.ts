import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

// 동시에 여러 워크스페이스에 들어갈 수 있기 때문에
// typescript는 빈객체 OR 빈배열일 경우 타입을 명시해줘야함.
const sockets: { [key: string]: SocketIOClient.Socket } = {};

// server 쪽에서 setting이 다 되어 있다는 전제하에 구현
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  // workspace가 없다면 undefined로 처리
  if (!workspace) {
    // 항상 return 모양은 같도록 하자.
    return [undefined, disconnect];
  }

  // 소캣이 존재하지 않으면
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      // 웹 소켓만 쓰도록 명시
      // http 연결을 안 하고 바로 soket 연결을 해서 cors에 걸리지 않음
      transports: ['websocket'],
    });
    console.info('create socket', workspace, sockets[workspace]);
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
