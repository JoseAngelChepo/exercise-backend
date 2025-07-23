import express from 'express';
import { getIO, sendNotification, broadcastMessage } from '../controllers/socketController.js';

const router = express.Router();

// Ruta para obtener información del servidor Socket.IO
router.get('/info', (req, res) => {
  try {
    const io = getIO();
    const connectedClients = io.engine.clientsCount;
    
    res.json({
      message: 'Socket.IO Server Info',
      connectedClients,
      timestamp: new Date().toISOString(),
      endpoints: {
        'POST /send-notification': 'Enviar notificación a un usuario específico',
        'POST /broadcast': 'Enviar mensaje a todos los clientes',
        'GET /rooms': 'Obtener información de salas activas'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Socket.IO no está inicializado' });
  }
});

// Ruta para enviar notificación a un usuario específico
router.post('/send-notification', (req, res) => {
  try {
    const { userId, notification } = req.body;
    
    if (!userId || !notification) {
      return res.status(400).json({ 
        error: 'userId y notification son requeridos' 
      });
    }

    sendNotification(userId, notification);
    
    res.json({
      message: 'Notificación enviada',
      userId,
      notification,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar mensaje a todos los clientes
router.post('/broadcast', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'message es requerido' 
      });
    }

    broadcastMessage(message);
    
    res.json({
      message: 'Mensaje broadcast enviado',
      content: message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener información de salas activas
router.get('/rooms', (req, res) => {
  try {
    const io = getIO();
    const rooms = io.sockets.adapter.rooms;
    
    const roomInfo = [];
    rooms.forEach((sockets, room) => {
      if (room !== room) { // Excluir salas de socket individuales
        roomInfo.push({
          room,
          clientCount: sockets.size,
          clients: Array.from(sockets)
        });
      }
    });
    
    res.json({
      message: 'Información de salas activas',
      rooms: roomInfo,
      totalRooms: roomInfo.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para simular eventos de ejemplo
router.post('/simulate-events', (req, res) => {
  try {
    const io = getIO();
    const { eventType } = req.body;
    
    switch (eventType) {
      case 'counter':
        const count = Math.floor(Math.random() * 100);
        io.emit('counter_updated', { count });
        break;
        
      case 'notification':
        io.emit('new_notification', {
          title: 'Notificación de ejemplo',
          message: 'Esta es una notificación simulada',
          type: 'info'
        });
        break;
        
      case 'status':
        io.emit('status_updated', {
          userId: 'server',
          status: 'online',
          timestamp: new Date().toISOString()
        });
        break;
        
      default:
        return res.status(400).json({ 
          error: 'eventType debe ser: counter, notification, o status' 
        });
    }
    
    res.json({
      message: 'Evento simulado enviado',
      eventType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 