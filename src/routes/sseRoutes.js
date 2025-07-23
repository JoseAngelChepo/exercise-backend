import express from 'express';
import { 
  sseHandler, 
  sendNotificationToAll, 
  sendDataUpdate, 
  sendCounterUpdate, 
  sendChatMessage,
  getSSEStats 
} from '../controllers/sseController.js';

const router = express.Router();

// Ruta principal para SSE
router.get('/events', sseHandler);

// Ruta para obtener estadísticas de conexiones SSE
router.get('/stats', (req, res) => {
  const stats = getSSEStats();
  res.json({
    message: 'Estadísticas de conexiones SSE',
    ...stats
  });
});

// Ruta para enviar notificación a todos los clientes SSE
router.post('/send-notification', (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ 
        error: 'title y message son requeridos' 
      });
    }

    sendNotificationToAll({
      title,
      message,
      type
    });
    
    res.json({
      message: 'Notificación enviada a todos los clientes SSE',
      notification: { title, message, type },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar actualización de datos
router.post('/send-data-update', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        error: 'data es requerido' 
      });
    }

    sendDataUpdate(data);
    
    res.json({
      message: 'Actualización de datos enviada',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar actualización de contador
router.post('/send-counter-update', (req, res) => {
  try {
    const { count } = req.body;
    
    if (count === undefined) {
      return res.status(400).json({ 
        error: 'count es requerido' 
      });
    }

    sendCounterUpdate(count);
    
    res.json({
      message: 'Actualización de contador enviada',
      count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar mensaje de chat
router.post('/send-chat-message', (req, res) => {
  try {
    const { username, message } = req.body;
    
    if (!username || !message) {
      return res.status(400).json({ 
        error: 'username y message son requeridos' 
      });
    }

    sendChatMessage({
      username,
      message,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      message: 'Mensaje de chat enviado',
      chatMessage: { username, message },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para simular diferentes tipos de eventos
router.post('/simulate-event', (req, res) => {
  try {
    const { eventType, data } = req.body;
    
    if (!eventType) {
      return res.status(400).json({ 
        error: 'eventType es requerido' 
      });
    }

    switch (eventType) {
      case 'notification':
        sendNotificationToAll({
          title: data?.title || 'Notificación simulada',
          message: data?.message || 'Esta es una notificación de ejemplo',
          type: data?.type || 'info'
        });
        break;
        
      case 'data_update':
        sendDataUpdate(data || { 
          users: Math.floor(Math.random() * 100),
          messages: Math.floor(Math.random() * 500)
        });
        break;
        
      case 'counter':
        sendCounterUpdate(data?.count || Math.floor(Math.random() * 100));
        break;
        
      case 'chat':
        sendChatMessage({
          username: data?.username || 'Usuario',
          message: data?.message || 'Mensaje de ejemplo'
        });
        break;
        
      default:
        return res.status(400).json({ 
          error: 'eventType debe ser: notification, data_update, counter, o chat' 
        });
    }
    
    res.json({
      message: 'Evento SSE simulado enviado',
      eventType,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener información de endpoints SSE
router.get('/info', (req, res) => {
  res.json({
    message: 'Server-Sent Events (SSE) Info',
    endpoints: {
      'GET /events': 'Establecer conexión SSE',
      'GET /stats': 'Obtener estadísticas de conexiones',
      'POST /send-notification': 'Enviar notificación a todos',
      'POST /send-data-update': 'Enviar actualización de datos',
      'POST /send-counter-update': 'Enviar actualización de contador',
      'POST /send-chat-message': 'Enviar mensaje de chat',
      'POST /simulate-event': 'Simular diferentes tipos de eventos'
    },
    eventTypes: [
      'connection',
      'welcome',
      'heartbeat',
      'notification',
      'data_update',
      'counter_update',
      'chat_message'
    ],
    timestamp: new Date().toISOString()
  });
});

export default router; 