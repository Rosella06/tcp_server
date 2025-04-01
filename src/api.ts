import express, { Express } from 'express';
import cors from 'cors';
import { PlcServer } from './plc';
import { PlcSendMessage } from './interface';

function expressServer(plcServer: PlcServer) {
    let app: Express | null = null
    let running = 0;
    function createServer() {
        return express();
    }
    const pad = (num: number, length: number) => num.toString().padStart(length, '0')
    function initRoute(app: Express) {
        app.post('/api/send', (req, res) => {
            const { floor, position, qty,container } = req.body;
            const body: PlcSendMessage = {
                floor: floor,
                position: position,
                qty: qty,
                container: container
            };
    
            if (!body.container || !body.floor || !body.qty || !body.position) {
                console.log('payload invalid');
                return;
            }
    
            console.log('Data received from client:', body);
    
          
            running = running >= 9 ? 1 : running + 1;
    
            const sumValue = body.container + body.floor + body.position + body.qty + 1 + 1 + 0 + running + 4500;
            const sum = pad(sumValue, 2).slice(-2);
            const message = `B${pad(body.container, 2)}R${pad(body.floor, 2)}C${pad(body.position, 2)}Q${pad(body.qty, 4)}L01M01T00N${running}D4500S${sum}`;
            
        
    
            const c = plcServer.sendToPLC(message);
            let responseSent = false;
    
            // c?.on('data', (data) => {
            //     if (!responseSent) {
            //         res.json({ message: 'Data received and sent to PLC', data: data.toString() });
            //         responseSent = true;
            //     }
            // });
            c?.once('data', (data) => {
                const responseMessage = data.toString();
                // console.log('✅ PLC Response:', responseMessage);
                res.json({ 
                    message: 'จัดยาเสร็จ', 
                    floor: body.floor, 
                    position: body.position 
                });
            });            
        });
    }
    
    function startServer(port: number) {
        try {
            app = createServer()
            app.use(express.json());
            app.use(cors());
            initRoute(app)
            app.listen(port, () => {
                console.log(`🚀 API server running on port : ${port}`);
            });
        }
        catch (ex) {
            console.log('error Api Server', ex)
        }
    }
    function getServer() {
        return app
    }
    return {
        getServer,
        startServer
    }
}
export { expressServer }



// import express, { Express } from 'express';
// import cors from 'cors';
// import { PlcServer } from './plc';
// import { PlcSendMessage } from './interface';
// import { getStatusT } from './constants';

// function expressServer(plcServer: PlcServer) {
//     let app: Express | null = null
//     let running = 0;
//     function createServer() {
//         return express();
//     }
//     const pad = (num: number, length: number) => num.toString().padStart(length, '0')
//     function initRoute(app: Express) {
//         app.post('/api/send', (req, res) => {
//             const { floor, position, qty,container } = req.body;
//             console.log (req.body)
//             const body: PlcSendMessage = {
//                 floor: floor,
//                 position: position,
//                 qty: qty,
//                 container: container
//             };
    
//             if (!body.container || !body.floor || !body.qty || !body.position) {
//                 console.log('payload invalid');
//                 return;
//             }
    
//             console.log('Data received from client:', body);
    
          
//             running = running >= 9 ? running=1 : running += 1;
    
//             const sumValue = body.container + body.floor + body.position + body.qty + 1 + 1 + 0 + running + 4500;
//             const sum = pad(sumValue, 2).slice(-2);
//             const message = `B${pad(body.container, 2)}R${pad(body.floor, 2)}C${pad(body.position, 2)}Q${pad(body.qty, 4)}L01M01T00N${running}D4500S${sum}`;
            
//             console.log('📤 Sending...', message);
    
//             const c = plcServer.sendToPLC(message);
//             // let responseSent = false;
    
//             c?.on('data', (data) => {
//                 const getStatus = getStatusT(data.toString().split("T", 2)[1]?.substring(0, 2) || "00")

//                 // getStatus.status === 001

//                 res.json({ message: 'Data received and sent to PLC', data: getStatus });
//                 // if (!responseSent) {
//                 //     res.json({ message: 'Data received and sent to PLC', data: data.toString() });
//                 //      responseSent = true;
//                 // }
//             });
//         });
//     }
    
//     function startServer(port: number) {
//         try {
//             app = createServer()
//             app.use(express.json());
//             app.use(cors());
//             initRoute(app)
//             app.listen(port, () => {
//                 console.log(`🚀 API server running on port : ${port}`);
//             });
//         }
//         catch (ex) {
//             console.log('error Api Server', ex)
//         }
//     }
//     function getServer() {
//         return app
//     }
//     return {
//         getServer,
//         startServer
//     }
// }
// export { expressServer }