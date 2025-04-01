import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import express from 'express';

class SocketIoService {
    private static instance: SocketIoService;
    private io: SocketIOServer | null = null;
    private server: http.Server | null = null;

    private constructor() {}

    public static getInstance(): SocketIoService {
        if (!SocketIoService.instance) {
            SocketIoService.instance = new SocketIoService();
        }
        return SocketIoService.instance;
    }

    public initialize(server: http.Server) {
        if (!this.io) {
            this.io = new SocketIOServer(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
                    allowedHeaders: [],
                    credentials: false
                }
            });

            this.io.on('connection', (socket) => {
                console.log('A user connected:', socket.id);
                socket.emit('message', 'Hello from server');

                socket.on('clientMessage', (data) => {
                    console.log('Message from client:', data);
                });

                socket.on('disconnect', () => {
                    console.log('A user disconnected');
                });
            });

            console.log('✅ Socket.IO initialized');
        }
    }

    public getIO(): SocketIOServer {
        if (!this.io) {
            throw new Error('Socket.IO has not been initialized. Call initialize(server) first.');
        }
        return this.io;
    }
}

export default SocketIoService;
