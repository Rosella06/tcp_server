import { expressServer } from './api'
import { plcServer } from './plc'
import SocketIoService from './socket'
import express from 'express'
import http from 'http'
const portApi = 3000
const portPlc = 2001
// 20045 
const portSocket = 3001

function main() {
    const app = express();
    const server = http.createServer(app);
    // for plc
    const plc = plcServer()
    plc.startPlcServer({ port: portPlc })

    // for react 
    const api = expressServer(plc)
    api.startServer(portApi)

    // for react 
    const socketService = SocketIoService.getInstance();
    socketService.initialize(server);

    server.listen(3002, () => {
        console.log('🚀 Server started on port 3002');
    })
}
main()