import { sendNotification } from './socketController.js';

// Almacenar las conexiones SSE activas
const sseConnections = new Map();

export const sseHandler = (req, res) => {
  // Configurar headers para SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Enviar un evento de conexión inicial
  res.write(`data: ${JSON.stringify({
    type: 'connection',
    message: 'Conexión SSE establecida',
    timestamp: new Date().toISOString()
  })}\n\n`);

  // Generar un ID único para esta conexión
  const connectionId = Date.now().toString();
  
  // Almacenar la conexión
  sseConnections.set(connectionId, res);

  console.log(`Nueva conexión SSE: ${connectionId}`);

  // Enviar un evento de bienvenida
  sendSSEEvent(connectionId, {
    type: 'welcome',
    message: '¡Bienvenido al servidor SSE!',
    connectionId,
    timestamp: new Date().toISOString()
  });

  // Ejemplo: Enviar actualizaciones periódicas
  const intervalId = setInterval(() => {
    sendSSEEvent(connectionId, {
      type: 'heartbeat',
      message: 'Ping del servidor',
      timestamp: new Date().toISOString()
    });
  }, 30000); // Cada 30 segundos

  // Manejar desconexión del cliente
  req.on('close', () => {
    console.log(`Conexión SSE cerrada: ${connectionId}`);
    sseConnections.delete(connectionId);
    clearInterval(intervalId);
  });

  // Manejar errores
  req.on('error', (error) => {
    console.error('Error en conexión SSE:', error);
    sseConnections.delete(connectionId);
    clearInterval(intervalId);
  });
};

// Función para enviar eventos SSE a una conexión específica
export const sendSSEEvent = (connectionId, data) => {
  const connection = sseConnections.get(connectionId);
  if (connection && !connection.destroyed) {
    try {
      connection.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('Error enviando evento SSE:', error);
      sseConnections.delete(connectionId);
    }
  }
};

// Función para enviar eventos a todas las conexiones SSE
export const broadcastSSEEvent = (data) => {
  const disconnectedConnections = [];
  
  sseConnections.forEach((connection, connectionId) => {
    if (!connection.destroyed) {
      try {
        connection.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error('Error enviando evento SSE:', error);
        disconnectedConnections.push(connectionId);
      }
    } else {
      disconnectedConnections.push(connectionId);
    }
  });

  // Limpiar conexiones desconectadas
  disconnectedConnections.forEach(id => sseConnections.delete(id));
};

// Ejemplo: Enviar notificación a todos los clientes SSE
export const sendNotificationToAll = (notification) => {
  broadcastSSEEvent({
    type: 'notification',
    ...notification,
    timestamp: new Date().toISOString()
  });
};

// Ejemplo: Enviar actualización de datos
export const sendDataUpdate = (data) => {
  broadcastSSEEvent({
    type: 'data_update',
    data,
    timestamp: new Date().toISOString()
  });
};

// Ejemplo: Enviar contador en tiempo real
export const sendCounterUpdate = (count) => {
  broadcastSSEEvent({
    type: 'counter_update',
    count,
    timestamp: new Date().toISOString()
  });
};

// Ejemplo: Enviar mensaje de chat
export const sendChatMessage = (message) => {
  broadcastSSEEvent({
    type: 'chat_message',
    message,
    timestamp: new Date().toISOString()
  });
};

// Función para obtener estadísticas de conexiones
export const getSSEStats = () => {
  return {
    activeConnections: sseConnections.size,
    timestamp: new Date().toISOString()
  };
}; 