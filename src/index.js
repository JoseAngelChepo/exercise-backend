import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';
import socketRoutes from './routes/socketRoutes.js';
import sseRoutes from './routes/sseRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { initializeSocket } from './controllers/socketController.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Inicializar Socket.IO
const io = initializeSocket(server);

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes);
app.use('/api/socket', socketRoutes);
app.use('/api/sse', sseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
