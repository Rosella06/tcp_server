import net from 'net'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT)
const HOST = process.env.HOST

const server = net.createServer((socket) => {
  console.log(`Client เชื่อมต่อ: ${socket.remoteAddress}:${socket.remotePort}`)

  socket.on('data', (data) => {
    console.log('ได้รับข้อมูล:', data.toString())
    socket.write(`ตอบกลับ: ${data}`)
  })

  socket.on('end', () => {
    console.log('Client ตัดการเชื่อมต่อ')
  })

  socket.on('error', (err) => {
    console.error('เกิดข้อผิดพลาด:', err)
  })
})

server.listen(PORT, HOST, () => {
  console.log(`TCP Server running at ${HOST}:${PORT}`)
})