// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Server } = require('socket.io');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createAdapter } = require('@socket.io/redis-adapter');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require('redis');

class SocketIoImpl {
  io;

  /**
   * Get the instance of the socket.io server.
   * @returns {Server}
   */
  getInstance() {
    return this.io;
  }

  /**
   * Initialize the socket.io server.
   * @param {*} httpServer
   */
  initialize(httpServer) {
    this.io = new Server(httpServer);

    // If there is a REDIS_URL environment variable, use Redis as the adapter
    if (process.env.REDIS_URL) {
      console.log('Using Redis as the adapter for socket.io');

      const pubClient = createClient({ url: process.env.REDIS_URL });
      pubClient.on('connect', () => {
        console.log('redis pubClient connected');
      });
      pubClient.on('error', (error) => {
        console.error('pubClient error:', error);
      });
      const subClient = pubClient.duplicate();
      subClient.on('connect', () => {
        console.log('redis subClient connected');
      });
      subClient.on('error', (error) => {
        console.error('subClient error:', error);
      });

      this.io.adapter(createAdapter(pubClient, subClient));

      Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        this.io.adapter(createAdapter(pubClient, subClient));
      });
    }

    this.io.on('connection', (socket) => {
      const { room } = socket.handshake.query;

      // If there is a room, join it
      if (room) {
        socket.join(room);
      }
    });
  }
}

module.exports = new SocketIoImpl();
