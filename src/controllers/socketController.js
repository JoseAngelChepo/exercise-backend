import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
      credentials: true
    }
  });

  console.log('Socket.IO inicializado');

  io.on('connection', (socket) => {
    // const token = socket.handshake.auth.token;
    console.log(`Usuario conectado: ${socket.id}`);

    // Ejemplo 1: Chat en tiempo real
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Usuario ${socket.id} se unió a la sala: ${room}`);
      socket.to(room).emit('user_joined', { userId: socket.id, room });
    });

    socket.on('send_message', (data) => {
      console.log('Mensaje recibido:', data);
      socket.to(data.room).emit('receive_message', {
        userId: socket.id,
        message: data.message,
        timestamp: new Date().toISOString(),
        username: data.username || 'Anónimo'
      });
    });

    // Ejemplo 2: Notificaciones en tiempo real
    socket.on('subscribe_notifications', (userId) => {
      socket.join(`notifications_${userId}`);
      console.log(`Usuario ${socket.id} suscrito a notificaciones para: ${userId}`);
    });

    // Ejemplo 3: Actualizaciones de estado
    socket.on('update_status', (data) => {
      socket.broadcast.emit('status_updated', {
        userId: socket.id,
        status: data.status,
        timestamp: new Date().toISOString()
      });
    });

    // Ejemplo 4: Contador en tiempo real
    socket.on('increment_counter', () => {
        console.log('se incremento el contador');
      // Simular un contador global
      const currentCount = Math.floor(Math.random() * 100);
      io.emit('counter_updated', { count: currentCount });
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.id}`);
      socket.broadcast.emit('user_disconnected', { userId: socket.id });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return io;
};

// Funciones para enviar eventos desde otros controladores
export const sendNotification = (userId, notification) => {
  if (io) {
    io.to(`notifications_${userId}`).emit('new_notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }
};

export const broadcastMessage = (message) => {
  if (io) {
    io.emit('broadcast_message', {
      message,
      timestamp: new Date().toISOString()
    });
  }
}; 