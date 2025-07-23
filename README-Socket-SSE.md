# Ejemplos de Socket.IO y Server-Sent Events (SSE)

Este proyecto incluye ejemplos completos de implementación de comunicación en tiempo real usando Socket.IO y Server-Sent Events (SSE).

## 🚀 Características

### Socket.IO
- ✅ Chat en tiempo real con salas
- ✅ Notificaciones personalizadas
- ✅ Contador en tiempo real
- ✅ Actualizaciones de estado de usuarios
- ✅ Broadcast de mensajes
- ✅ Gestión de conexiones y desconexiones

### Server-Sent Events (SSE)
- ✅ Conexión persistente unidireccional
- ✅ Notificaciones en tiempo real
- ✅ Actualizaciones de datos
- ✅ Contador en tiempo real
- ✅ Mensajes de chat
- ✅ Simulación de eventos

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/
│   │   ├── socketController.js    # Controlador Socket.IO
│   │   └── sseController.js       # Controlador SSE
│   ├── routes/
│   │   ├── socketRoutes.js        # Rutas Socket.IO
│   │   └── sseRoutes.js           # Rutas SSE
│   └── index.js                   # Servidor principal
├── examples/
│   ├── socket-example.html        # Ejemplo frontend Socket.IO
│   └── sse-example.html           # Ejemplo frontend SSE
└── README-Socket-SSE.md          # Esta documentación
```

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install socket.io
```

2. **Iniciar el servidor:**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5001`

## 📡 Endpoints de Socket.IO

### Información del Servidor
- **GET** `/api/socket/info` - Información del servidor Socket.IO

### Gestión de Notificaciones
- **POST** `/api/socket/send-notification` - Enviar notificación a usuario específico
- **POST** `/api/socket/broadcast` - Enviar mensaje a todos los clientes

### Información de Salas
- **GET** `/api/socket/rooms` - Obtener información de salas activas

### Simulación de Eventos
- **POST** `/api/socket/simulate-events` - Simular eventos del servidor

## 📡 Endpoints de SSE

### Conexión SSE
- **GET** `/api/sse/events` - Establecer conexión SSE

### Gestión de Eventos
- **POST** `/api/sse/send-notification` - Enviar notificación a todos
- **POST** `/api/sse/send-data-update` - Enviar actualización de datos
- **POST** `/api/sse/send-counter-update` - Enviar actualización de contador
- **POST** `/api/sse/send-chat-message` - Enviar mensaje de chat

### Simulación y Estadísticas
- **POST** `/api/sse/simulate-event` - Simular diferentes tipos de eventos
- **GET** `/api/sse/stats` - Estadísticas de conexiones SSE
- **GET** `/api/sse/info` - Información de endpoints SSE

## 🔌 Eventos de Socket.IO

### Eventos del Cliente al Servidor
- `join_room` - Unirse a una sala
- `send_message` - Enviar mensaje de chat
- `subscribe_notifications` - Suscribirse a notificaciones
- `update_status` - Actualizar estado del usuario
- `increment_counter` - Incrementar contador

### Eventos del Servidor al Cliente
- `user_joined` - Usuario se unió a una sala
- `receive_message` - Recibir mensaje de chat
- `new_notification` - Nueva notificación
- `counter_updated` - Contador actualizado
- `status_updated` - Estado de usuario actualizado
- `broadcast_message` - Mensaje broadcast
- `user_disconnected` - Usuario desconectado

## 📨 Tipos de Eventos SSE

### Eventos Automáticos
- `connection` - Conexión establecida
- `welcome` - Mensaje de bienvenida
- `heartbeat` - Ping del servidor (cada 30s)

### Eventos de Aplicación
- `notification` - Notificaciones
- `data_update` - Actualizaciones de datos
- `counter_update` - Actualizaciones de contador
- `chat_message` - Mensajes de chat

## 🎯 Ejemplos de Uso

### Socket.IO - Frontend

```javascript
// Conectar al servidor
const socket = io('http://localhost:5001');

// Unirse a una sala
socket.emit('join_room', 'general');

// Enviar mensaje
socket.emit('send_message', {
    message: 'Hola mundo',
    room: 'general',
    username: 'Usuario'
});

// Escuchar mensajes
socket.on('receive_message', (data) => {
    console.log(`${data.username}: ${data.message}`);
});

// Suscribirse a notificaciones
socket.emit('subscribe_notifications', 'user123');

// Escuchar notificaciones
socket.on('new_notification', (data) => {
    console.log('Nueva notificación:', data);
});
```

### SSE - Frontend

```javascript
// Establecer conexión SSE
const eventSource = new EventSource('http://localhost:5001/api/sse/events');

// Escuchar eventos
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Evento recibido:', data);
};

// Manejar conexión
eventSource.onopen = () => {
    console.log('Conexión SSE establecida');
};

// Manejar errores
eventSource.onerror = (error) => {
    console.error('Error SSE:', error);
};
```

## 🧪 Probar los Ejemplos

1. **Iniciar el servidor:**
```bash
npm run dev
```

2. **Abrir los ejemplos en el navegador:**
   - Socket.IO: `examples/socket-example.html`
   - SSE: `examples/sse-example.html`

3. **Probar funcionalidades:**
   - Abrir múltiples pestañas para ver comunicación en tiempo real
   - Usar los botones de simulación para generar eventos
   - Probar el chat con diferentes usuarios
   - Verificar las notificaciones y contadores

## 📊 Diferencias entre Socket.IO y SSE

| Característica | Socket.IO | SSE |
|----------------|-----------|-----|
| **Dirección** | Bidireccional | Unidireccional (servidor → cliente) |
| **Protocolo** | WebSocket + fallback | HTTP |
| **Reconexión** | Automática | Manual |
| **Eventos** | Personalizados | Estándar |
| **Compatibilidad** | Excelente | Buena |
| **Complejidad** | Media | Baja |
| **Casos de uso** | Chat, juegos, apps interactivas | Notificaciones, feeds, dashboards |

## 🔧 Configuración Avanzada

### Socket.IO - Configuración CORS
```javascript
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    }
});
```

### SSE - Headers Personalizados
```javascript
res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
});
```

## 🚨 Consideraciones de Seguridad

1. **Validar datos de entrada** en todos los endpoints
2. **Implementar autenticación** para Socket.IO
3. **Limitar conexiones** por IP para SSE
4. **Sanitizar mensajes** antes de broadcast
5. **Usar HTTPS** en producción

## 📈 Monitoreo y Debugging

### Socket.IO
```javascript
// Log de conexiones
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    console.log(`Total de clientes: ${io.engine.clientsCount}`);
});
```

### SSE
```javascript
// Estadísticas de conexiones
const stats = getSSEStats();
console.log(`Conexiones SSE activas: ${stats.activeConnections}`);
```

## 🎓 Casos de Uso Educativos

### Socket.IO
- Chat en tiempo real
- Juegos multijugador
- Dashboards colaborativos
- Notificaciones push
- Aplicaciones de trading

### SSE
- Feeds de noticias
- Actualizaciones de estado
- Monitoreo de sistemas
- Notificaciones de sistema
- Dashboards en tiempo real

## 📚 Recursos Adicionales

- [Socket.IO Documentation](https://socket.io/docs/)
- [MDN - Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [WebSocket vs SSE](https://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

---

**¡Disfruta aprendiendo sobre comunicación en tiempo real! 🚀** 