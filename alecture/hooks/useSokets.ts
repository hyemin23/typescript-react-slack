import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

// 동시에 여러 워크스페이스에 들어갈 수 있기 때문에
// typescript는 빈객체 OR 빈배열일 경우 타입을 명시해줘야함.
const sockets: { [key: string]: SocketIOClient.Socket } = {};

// server 쪽에서 setting이 다 되어 있다는 전제하에 구현
const useSocket = (workspace?: string) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
    }
  }, [workspace]);

  // workspace는 필수
  if (!workspace) {
    // 항상 return 모양은 같도록 하자.
    return [undefined, disconnect];
  }

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
    transports: ['websocket'],
  });

  return [sockets[workspace], disconnect];
};

export default useSocket;
