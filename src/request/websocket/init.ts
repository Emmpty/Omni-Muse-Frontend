import WS from '~/request/websocket';

export const getSocket = async () => {
  await initSocket();
  const socket: WebSocket = WS.get() as WebSocket;
  return socket;
};

export const initSocket = async () => {
  const readyState = WS.getState();
  const socket = WS.get();
  if (!readyState && !socket) {
    console.log('初始化socket');
    await new Promise((resolve, reject) => {
      resolve(WS.onlink());
    });
  }
};
