// import net from 'net';

// const PORT = 4000;

// // สร้าง TCP Server
// const server = net.createServer((socket) => {
//     console.log('Client connected');

//     socket.on('data', (data) => {
//         console.log('Received:', data.toString());
//         socket.write(`Echo: ${data.toString()}`);
//     });

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });
// });

// server.listen(PORT, () => {
//     console.log(`TCP Server is running on port ${PORT}`);
// });
