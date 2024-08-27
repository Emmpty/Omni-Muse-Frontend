class Sub {
  subscribers: any = [];
  constructor() {
    this.subscribers = [];
  }

  subscribe(callback: any) {
    this.subscribers.push(callback);
  }

  publish(data: any) {
    this.subscribers.forEach((subscriber: any) => subscriber(data));
  }
}

const socket = new Sub();
export class WS {
  static socket: WebSocket | null = null;
  static onmessage = null;
  static open = () => {
    const token = localStorage ? localStorage.getItem('token') || '' : '';
    const loc = window.location;
    let protocol = 'wss:';
    if (loc.protocol === 'http:') {
      protocol = 'ws:';
    }
    const defaultUrl = `${protocol}${loc.host}${process.env.NEXT_PUBLIC_WS}/ws?token=${token}`;
    const WS_URL =
      process.env.NODE_ENV === 'development'
        ? `${process.env.NEXT_PUBLIC_WS}?token=${token}`
        : defaultUrl;
    WS.socket = new WebSocket(WS_URL);
    WS.socket.onopen = () => {
      console.log('链接已开启');
    };
    WS.socket.onclose = () => {
      console.log('链接关闭, 正在尝试重链接');
      WS.open();
    };

    WS.socket.onmessage = (event: any) => {
      const _message = JSON.parse(event.data).message;
      const message = JSON.parse(_message);
      console.log(message, '监听到信息推送');
      socket.publish(message);
    };
  };
}
export default socket;
