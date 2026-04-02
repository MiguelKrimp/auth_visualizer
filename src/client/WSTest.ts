import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/spy');

let sessionId: string | undefined = undefined;

socket.on('sessionId', (ev) => {
  console.log('Received session ID:', ev);
  sessionId = ev;
});

socket.on('pause', (data) => {
  console.log('Paused at step:', data.name, 'with data:', data.data);
  setTimeout(() => {
    socket.emit(data.name);
  }, 2000);
});
