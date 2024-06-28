import { createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

type OpenSocketOptions = { query: Record<string, string> };

type SocketContext = {
  io: ReturnType<typeof io> | null;
  open(options: OpenSocketOptions): void;
  close(): void;
};

const Context = createContext<SocketContext | null>(null);

export function useSocket() {
  return useContext(Context);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  const open = (options: OpenSocketOptions) => {
    const _socket = io({ query: options.query });
    _socket.connect();
    setSocket(_socket);
  };

  const close = () => {
    socket?.close();
  };

  return (
    <Context.Provider value={{ io: socket, open, close }}>
      {children}
    </Context.Provider>
  );
}
