import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SPARKER_URL || 'http://localhost:3003';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(chatId) {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to Sparker');
      this.socket.emit('spawn_agent', { chatId });
    });

    this.socket.on('agent_output', (data) => {
      this.emit('output', data);
    });

    this.socket.on('agent_status', (data) => {
      this.emit('status', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Sparker');
    });
  }

  sendMessage(chatId, message) {
    if (this.socket?.connected) {
      this.socket.emit('send_input', { chatId, input: message });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}

export const socketService = new SocketService();
