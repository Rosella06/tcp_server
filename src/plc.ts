import * as net from 'net';
import { resolve } from 'path';
// import getStatusTs from "./constants"

function plcServer() {
    let server: net.Server | null = null;
    let client: net.Socket | null = null;

    function getStatusT(status: string, qty?: string): string {
        console.log("Received Status Code:", status);
        switch (status) {
    
            case '01': return 'ขาดการเชื่อมต่อจากเซิร์ฟเวอร์'; 
            case '02': return 'ชุดคำสั่งไม่ถูกต้อง'; 
            case '03': return `Checksum ในชุดคำสั่งไม่ถูกต้อง (Sxx)`; 
            case '04': return 'คาร์ทีเซียนแกนนอนไม่เข้าตำแหน่ง';
            case '05': return 'คาร์ทีเซียนแกนตั่งไม่เข้าตำแหน่ง';
            case '06': return 'กลไกหยิบขาไม่เข้าตำแหน่ง';
            case '07': return 'คาร์ทีเซียนแกนนอนไม่เคลื่อนที่ไปยังโมดูล';
            case '08': return 'คาร์ทีเซียนแกนตั่งไม่เคลื่อนที่ไปยังโมดูล';
            case '91': return 'ได้รับคำสั่งแล้ว';
            case '92': return `จ่ายยาสำเร็จ และแสดงยาที่จัดได้ใน Q${qty}`;
            default: return 'T00';
        }
    }

    function startPlcServer({ port }: { port: number }) {

        server = net.createServer((socket) => {
            client = socket;

            console.log('📡 PLC Connected:', socket.remoteAddress, socket.remotePort);

            socket.on('data', (data) => {
                console.log('📥 Received from PLC:', data.toString());
                const status = data.toString().split("T", 2)[1]?.substring(0, 2) || "00";
                const response = getStatusT(status);
                console.log('Status:', response);
                // socket.write(response);
            });

            socket.on('close', () => {
                console.log('❌ PLC Disconnected');
                client = null;
            });

            socket.on('error', (err) => {
                console.log('⚠️ Socket Error:', err.message);
            });
        });

        server.listen(port, () => {
            console.log(`🚀 PLC Server started on port : ${port}`);
        });

        server.on('error', (err) => {
            console.log('⚠️ Server Error:', err.message);
        });
    }

    function  sendToPLC(data: string) {
        if (!client) {
            console.log('⚠️ No PLC Connected');
            return;
        }
        console.log('📤 Sending to PLC:', data);
        client.write(data);

        return client;
    }

    return {
        startPlcServer,
        sendToPLC
    };
}

export type PlcServer = ReturnType<typeof plcServer>;
export { plcServer };