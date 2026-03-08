import * as pty from 'node-pty';
import stripAnsi from 'strip-ansi';

const processes = new Map();

export function spawnAgent(chatId, socket) {
  if (processes.has(chatId)) {
    return { error: 'Agent already running for this chat' };
  }

  const shell = process.env.SHELL || '/bin/bash';
  const ptyProcess = pty.spawn('opencode', ['run', '--model', 'opencode/minimax-m2.5-free'], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME || '/root',
    env: process.env
  });

  processes.set(chatId, { process: ptyProcess, socket });

  ptyProcess.onData((data) => {
    const clean = stripAnsi(data);
    socket.emit('agent_output', { chatId, output: clean, raw: data });
  });

  ptyProcess.onExit(({ exitCode }) => {
    socket.emit('agent_status', { chatId, status: 'done', exitCode });
    processes.delete(chatId);
  });

  socket.emit('agent_status', { chatId, status: 'started' });
  return { success: true, chatId };
}

export function sendInput(chatId, input) {
  const agent = processes.get(chatId);
  if (agent) {
    agent.process.write(input + '\r');
    return { success: true };
  }
  return { error: 'No agent running for this chat' };
}

export function killAgent(chatId) {
  const agent = processes.get(chatId);
  if (agent) {
    agent.process.kill();
    processes.delete(chatId);
    return { success: true };
  }
  return { error: 'No agent running for this chat' };
}

export function getStatus(chatId) {
  return { running: processes.has(chatId) };
}
