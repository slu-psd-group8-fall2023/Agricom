import { io } from 'socket.io-client';

export class SocketioService {

  socket:any;

  constructor() {   }

  setupSocketConnection() {
    this.socket = io("http://localhost:3000");
  }
}