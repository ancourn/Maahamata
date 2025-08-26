import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to OrbitOS AI server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from OrbitOS AI server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;