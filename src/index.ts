import net from 'net'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT) ?? 3000
const HOST = process.env.HOST ?? "127.0.0.1"

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
  console.log(`TCP Server รันอยู่ที่ ${HOST}:${PORT}`)
})