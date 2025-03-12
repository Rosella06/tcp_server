// import net from 'net'

// let running = 1
// const body = {
//     floor: 1,
//     position: 12,
//     qty: 3
// }

// function getStatusT(status: string): string {
//     console.log(status)
//     switch (status) {
//         case '01':
//             console.log("ได้รับคำสั่งแล้ว")
//             return 'T01'; // รอจัดยา
//         case 'preparing':
//             return 'T02'; // กำลังจัดยา
//         case 'done':
//             return 'T03'; // จัดยาเสร็จ
//         default:
//             return 'T00'; // ค่าเริ่มต้น
//     }
// }
// const server = net.createServer((socket) => {
//     console.log('🔗 Client connected:', socket.remoteAddress, socket.remotePort);

//     setInterval(() => {
//         const pad = (num: number, length: number) => num.toString().padStart(length, '0');

//         const newFloor = pad(body.floor, 2);
//         const newPosition = pad(body.position, 2);
//         const newQty = pad(body.qty, 4);

//         running = running > 9 ? 1 : running;

//         const sumValue = 1 + 1 + 1 + 4500 + body.floor + body.position + body.qty + running;
//         const sum = pad(sumValue, 2).slice(-2);

//         const message = `B01R${newFloor}C${newPosition}Q${newQty}L01M01T00N${running}D4500S${sum}`;

//         console.log('📤 Sending...', message);
//         socket.write(message);

//         running++;
//     }, 2000);

//     // รับข้อมูลจาก PLC
//     socket.on('data', (data) => {
//         getStatusT(data.toString().split("T",2)[1].substring(0,2))
//         console.log('📥 Received from PLC:', data.toString());

//         // // ส่งข้อความกลับไปที่ PLC (Echo Message)
//         // socket.write(data);
//         // console.log('📤 Sent back:', data.toString());
//     });

//     // จัดการกรณีขาดการเชื่อมต่อ
//     socket.on('end', () => {
//         console.log('❌ Client disconnected');
//     });

//     socket.on('error', (err) => {
//         console.error('⚠️ Error:', err.message);
//     });
// });

// server.listen(2001, () => {
//     console.log('🚀 TCP Server กำลังทำงานที่ 2001');
// });

// import net from 'net';
// import WebSocket, { WebSocketServer } from 'ws';

// let running = 1;
// const plcSocket = new net.Socket();

// // เชื่อมต่อกับ PLC ที่ IP 192.168.0.6 และ Port 2000
// plcSocket.connect(2000, '192.168.0.6', () => {
//     console.log('✅ Connected to PLC');
// });

// // จัดการข้อผิดพลาดของ TCP Socket
// plcSocket.on('error', (err) => {
//     console.error('⚠️ Error with PLC connection:', err.message);
// });

// // รับข้อมูลจาก PLC
// plcSocket.on('data', (data) => {
//     console.log('📥 Received from PLC:', data.toString());
// });

// // TCP Server สำหรับการเชื่อมต่อกับไคลเอนต์
// const server = net.createServer((socket) => {
//     console.log('🔗 Client connected:', socket.remoteAddress, socket.remotePort);

//     // รับข้อมูลจากไคลเอนต์
//     socket.on('data', (data) => {
//         console.log('📥 Received from client:', data.toString());
//     });

//     socket.on('end', () => console.log('❌ Client disconnected'));
//     socket.on('error', (err) => console.error('⚠️ Error:', err.message));
// });

// // เซิร์ฟเวอร์ TCP ฟังที่พอร์ต 2001
// server.listen(2001, () => console.log('🚀 TCP Server กำลังทำงานที่พอร์ต 2001'));

// // WebSocket Server สำหรับการเชื่อมต่อกับ React
// const wss = new WebSocketServer({ port: 8080 });

// wss.on('connection', (ws) => {
//     console.log('🔗 WebSocket Client Connected');

//     // รับข้อความจาก React
//     ws.on('message', (message) => {
//         console.log('📩 Received from React:', message.toString());

//         const messageStr = typeof message === 'string' ? message : message.toString();

//         try {
//             const body = JSON.parse(messageStr); 
//             console.log('📥 Parsed body:', body);

//             // ฟังก์ชันสำหรับจัดรูปแบบตัวเลขให้มีความยาวตามที่ต้องการ
//             const pad = (num: { toString: () => string; }, length: number) => num.toString().padStart(length, '0');

//             // แปลงค่า floor, position, qty ให้เป็นรูปแบบที่ต้องการ
//             const newFloor = pad(body.floor, 2);
//             const newPosition = pad(body.position, 2);
//             const newQty = pad(body.qty, 4);

//             // เพิ่มค่าตัวแปร running และคำนวณ sum
//             running = running > 9 ? 1 : running;
//             const sumValue = 1 + 1 + 1 + 4500 + body.floor + body.position + body.qty + running;
//             const sum = pad(sumValue, 2).slice(-2);

//             // สร้างข้อความที่ต้องการส่งไปยัง PLC
//             const messageToPLC = `B01R${newFloor}C${newPosition}Q${newQty}L01M01T01N${running}D4500S${sum}`;
//             console.log('📤 Sending to PLC:', messageToPLC);

//             // ส่งข้อความไปยัง PLC ผ่าน TCP Socket
//             plcSocket.write(messageToPLC);

//             // ส่งข้อความตอบกลับไปยัง React
//             ws.send(JSON.stringify({ status: 'success', sent: messageToPLC }));

//             // เพิ่มค่า running สำหรับการใช้งานครั้งถัดไป
//             running++;
//         } catch (error) {
//             console.error('⚠️ Error parsing JSON:', error);
//             ws.send(JSON.stringify({ status: 'error', message: 'Invalid JSON format' }));
//         }
//     });

//     // จัดการการเชื่อมต่อปิด
//     ws.on('close', () => {
//         console.log('❌ WebSocket Client Disconnected');
//     });

//     // จัดการข้อผิดพลาดของ WebSocket
//     ws.on('error', (err) => {
//         console.error('⚠️ WebSocket Error:', err.message);
//     });
// });


// import express from 'express';
// import net from 'net';
// import cors from 'cors';

// const app = express();

// // ใช้ CORS middleware
// app.use(cors());

// app.use(express.json()); // To handle JSON requests

// let body = {
//     floor: 1,
//     position: 12,
//     qty: 3
// };

// function getStatusT(status: string, qty?: string): string {
//     console.log(status);
//     switch (status) {
//         case '01':
//             console.log("ได้รับคำสั่งแล้ว");
//             return 'T01'; 
//         case '02':
//             console.log("จ่ายยำสำเร็จ ครบตามจำนวน");
//             return 'T02'; // จ่ายยำสำเร็จ ครบตามจำนวน
//         case '03':
//             console.log("จ่ายยำสำเร็จ แต่ไม่ครบตามจำนวน");
//             return `T03 - ยำที่จัดได้ Q${qty}`; // จ่ายยำสำเร็จ แต่ไม่ครบตามจำนวน (แสดงยำที่จัดได้ใน Qxxxx)
//         case '80':
//             return 'ผิดพลำด เนื่องจากตัวควบคุมหลักไม่พร้อมใช้งาน'; // 80
//         case '81':
//             return 'ผิดพลำด เนื่องจากตัวควบคุมกลไกไม่พร้อมใช้งาน'; // 81
//         case '82':
//             return 'ผิดพลำด เนื่องจากสถานะตู้ไม่พร้อมใช้งาน'; // 82
//         case '83':
//             return 'ผิดพลำด เนื่องจากพารามิเตอร์ไม่สอดคล้องกับฮาร์ดแวร์'; // 83
//         case '90':
//             return 'การทำงานของตัวควบคุมหลักล้มเหลว'; // 90
//         case '91':
//             return 'การทำงานของตัวควบคุมกลไกล้มเหลว'; // 91
//         case '92':
//             return 'สถานะของตู้ล้มเหลว'; // 92
//         default:
//             return 'T00'; // ค่าเริ่มต้น (หากไม่พบสถานะที่ตรงกัน)
//     }
// }

// // ตัวแปรสำหรับ running
// let running = 1; 
// // ฟังก์ชัน pad สำหรับเติมเลข 0
// function pad(num: number, length: number): string {
//     return String(num).padStart(length, '0');
// }

// // API เพื่อรับข้อมูลจาก React และอัปเดตสถานะ
// app.post('/api/send', (req, res) => {
//     const { floor, position, qty } = req.body;

//     // อัปเดตข้อมูลของ body
//     if (floor !== undefined) body.floor = floor;
//     if (position !== undefined) body.position = position;
//     if (qty !== undefined) body.qty = qty;

//     console.log('Data received from client:', body);

//     // คำนวณค่าผลรวม
//     const sumValue = 1 + 1 + 1 + 4500 + body.floor + body.position + body.qty + running;
//     const sum = pad(sumValue, 2).slice(-2);  // คำนวณ sum ให้เป็น 2 หลัก

//     // ส่งข้อมูลไปยัง TCP server
//     sendToTCPServer(body, sum);

  
//     running = running > 9 ? 1 : running + 1; 
    

//     res.json({ message: 'Data received and sent to PLC', body });
// });

// // ฟังก์ชันที่ส่งข้อมูลไปยัง TCP server
// function sendToTCPServer(body: { floor: any; position: any; qty: any; }, sum: string) {
//     const client = new net.Socket();
//     client.connect(2001, 'localhost', () => {
//         console.log('Connected to PLC server');

//         // เตรียมข้อมูลเพื่อส่งไปยัง PLC
//         const newFloor = pad(body.floor, 2);
//         const newPosition = pad(body.position, 2);
//         const newQty = pad(body.qty, 4);

//         const message = `B01R${newFloor}C${newPosition}Q${newQty}L01M01T00N${running}D4500S${+sum+1}`;

//         console.log('Sending to PLC:', message);
//         client.write(message);
//     });

//     client.on('data', (data) => {
//         const statusPlc = getStatusT(data.toString().split("T",2)[1].substring(0,2), body.qty.toString());
//         console.log('📥 Received from PLC:', data.toString());
//         console.log('Status:', statusPlc);
//     });

//     client.on('close', () => {
//         console.log('Connection to PLC closed');
//     });
// }

// // สร้าง TCP server
// const server = net.createServer((socket) => {
//     console.log('🔗 Client connected:', socket.remoteAddress, socket.remotePort);

//     socket.on('data', (data) => {
//         console.log('📥 Received from PLC:', data.toString());
//     });

//     socket.on('end', () => {
//         console.log('❌ Client disconnected');
//     });

//     socket.on('error', (err) => {
//         console.error('⚠️ Error:', err.message);
//     });
// });

// server.listen(2001, () => {
//     console.log('🚀 TCP Server กำลังทำงานที่ 2001');
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`🚀 API server running on http://localhost:${port}`);
// });

// import net from 'net'

// let running = 1
// const body = {
//     floor: 1,
//     position: 2,
//     qty: 3,
//     b:1,
// }

// function getStatusT(status: string): string {
//     console.log(status)
//     switch (status) {
//         case '01':
//             console.log("ได้รับคำสั่งแล้ว")
//             return 'T01'; // รอจัดยา
//         case 'preparing':
//             return 'T02'; // กำลังจัดยา
//         case 'done':
//             return 'T03'; // จัดยาเสร็จ
//         default:
//             return 'T00'; // ค่าเริ่มต้น
//     }
// }
// const server = net.createServer((socket) => {
//     console.log('🔗 Client connected:', socket.remoteAddress, socket.remotePort);

//     setInterval(() => {
//         const pad = (num: number, length: number) => num.toString().padStart(length, '0');
//         const newFloor = pad(body.floor, 2);
//         const newPosition = pad(body.position, 2);
//         const newQty = pad(body.qty, 4);
//         const newMachine= pad(body.b,2)
//         running = running > 9 ? 1 : running;
//         const sumValue = body.b + body.floor + body.position+body.qty+1+1+0+running + 4500;
//         console.log('sum is ',sumValue)
//         const sum = pad(sumValue, 2).slice(-2);
//         const message = `B${newMachine}R${newFloor}C${newPosition}Q${newQty}L01M01T00N${running}D4500S${sum}`;
//         console.log('📤 Sending...', message);
//         socket.write(message);
//         running++;
//     }, 2000);

//     socket.on('data', (data) => {
//       const status =   data.toString().split("T",2)[1].substring(0,2)
//       const display = getStatusT(status)
//         console.log('📥 Received from PLC:', data.toString());
//         console.log('📥 Received from PLC status :', status);
//         console.log('📥 Received from PLC display :',display);

//     });

//     // จัดการกรณีขาดการเชื่อมต่อ
//     socket.on('end', () => {
//         console.log('❌ Client disconnected');
//     });

//     socket.on('error', (err) => {
//         console.error('⚠️ Error:', err.message);
//     });
// });

// server.listen(2001, () => {
//     console.log('🚀 TCP Server กำลังทำงานที่ 2001');
// });


// import express from 'express';
// import net from 'net';
// import cors from 'cors';

// const app = express();


// app.use(cors());

// app.use(express.json()); 

// let running = 1;


// function pad(num: number, length: number): string {
//   return String(num).padStart(length, '0');
// }

// // ฟังก์ชันเพื่อแปลงสถานะ
// function getStatusT(status: string, qty?: string): string {
//   console.log(status);
//   switch (status) {
//     case '01':
//       console.log("ได้รับคำสั่งแล้ว");
//       return 'T01'; 
//     case '02':
//       console.log("จ่ายยำสำเร็จ ครบตามจำนวน");
//       return 'T02'; // จ่ายยำสำเร็จ ครบตามจำนวน
//     case '03':
//       console.log("จ่ายยำสำเร็จ แต่ไม่ครบตามจำนวน");
//       return `T03 - ยำที่จัดได้ Q${qty}`; // จ่ายยำสำเร็จ แต่ไม่ครบตามจำนวน (แสดงยำที่จัดได้ใน Qxxxx)
//     default:
//       return 'T00'; // ค่าผิดพลาด
//   }
// }

// // API เพื่อรับข้อมูลจาก React และอัปเดตสถานะ
// app.post('/api/send', (req, res) => {
//   const { floor, position, qty } = req.body; 

//   // คำนวณค่าผลรวม
//   const sumValue = 1 + 1 + 1 + 4500 + floor + position + qty + running;
//   const sum = pad(sumValue, 2).slice(-2);  // คำนวณ sum ให้เป็น 2 หลัก

//   console.log('Data received from client:', { floor, position, qty });

//   // ส่งข้อมูลไปยัง TCP server
//   sendToTCPServer({ floor, position, qty }, sum);

//   running = running > 9 ? 1 : running + 1;

//   res.json({ message: 'Data received and sent to PLC', body: { floor, position, qty } });
// });

// // ฟังก์ชันที่ส่งข้อมูลไปยัง TCP server
// function sendToTCPServer(body: { floor: any; position: any; qty: any; }, sum: string) {
//   const client = new net.Socket();
//   client.connect(2001, 'localhost', () => {
//     console.log('Connected to PLC server');

//     // เตรียมข้อมูลเพื่อส่งไปยัง PLC
//     const newFloor = pad(body.floor, 2);
//     const newPosition = pad(body.position, 2);
//     const newQty = pad(body.qty, 4);

//     const message = `B01R${newFloor}C${newPosition}Q${newQty}L01M01T00N${running}D4500S${sum}`;

//     console.log('Sending to PLC:', message);
//     client.write(message);
//   });

//   client.on('data', (data) => {
//     console.log('📥 Received from PLC:', data.toString()); 
//     const response = data.toString();
//     if (response.includes("T")) {
//       const statusPlc = getStatusT(response.split("T", 2)[1].substring(0, 2), body.qty.toString());
//       console.log('PLC Status:', statusPlc);
//     } else {
//       console.log("PLC did not return the expected response.");
//     }
//   });
  


//   client.on('close', () => {
//     console.log('Connection to PLC closed');
//   });
// }

// // สร้าง TCP server
// const server = net.createServer((socket) => {
//     console.log('🔗 Client connected:', socket.remoteAddress, socket.remotePort);
  
//     socket.on('data', (data) => {
//       console.log('📥 Received from PLC:', data.toString());
//     });
  
//     socket.on('end', () => {
//       console.log('❌ Client disconnected');
//     });
  
//     socket.on('error', (err) => {
//       console.error('⚠️ Error:', err.message);
//     });
//   });
  
//   server.listen(2001, () => {
//     console.log('🚀 TCP Server กำลังทำงานที่ 2001');
//   });
  

// const port = 3000;
// app.listen(port, () => {
//   console.log(`🚀 API server running on http://localhost:${port}`);
// });

