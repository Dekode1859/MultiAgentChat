import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { spawnAgent, sendInput, killAgent, getStatus } from './lib/ptyManager.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.post('/spawn', (req, res) => {
  const { chatId } = req.body;
  const result = spawnAgent(chatId, io);
  res.json(result);
});

app.get('/status/:chatId', (req, res) => {
  res.json(getStatus(req.params.chatId));
});

app.post('/input/:chatId', (req, res) => {
  const { input } = req.body;
  const result = sendInput(req.params.chatId, input);
  res.json(result);
});

app.delete('/kill/:chatId', (req, res) => {
  const result = killAgent(req.params.chatId);
  res.json(result);
});

io.on('connection', (socket) => {
  socket.on('spawn_agent', ({ chatId }) => {
    spawnAgent(chatId, socket);
  });

  socket.on('send_input', ({ chatId, input }) => {
    sendInput(chatId, input);
  });

  socket.on('kill_agent', ({ chatId }) => {
    killAgent(chatId);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Sparker service running on port ${PORT}`);
});
