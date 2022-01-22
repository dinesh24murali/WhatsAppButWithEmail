const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const jwt = require('jsonwebtoken');

const onConnect = require('./modules/onConnect');
const onDisconnect = require('./modules/onDisconnect');
const onMessage = require('./modules/onMessage');

require('dotenv').config();

const port = process.env.SOCKET_PORT;

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_BASE_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["x-access-token"]
    }
});

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
}).on("connection", (socket) => {

    onConnect(socket);

    socket.on('disconnect', () => {
        // console.log('disconnected!');
        onDisconnect(socket);
    });

    socket.on('message', data => {
        onMessage(socket, data);
    });
});

httpServer.listen(port);
