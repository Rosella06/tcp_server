import net from 'net'
import dotenv from 'dotenv'

dotenv.config()

const PORT = 5698
const HOST = "103.99.11.97"

const client = new net.Socket()

client.connect(PORT, HOST, () => {
  console.log('Connected!')
  client.write('Hello world')
})

client.on('data', (message) => {
  console.log('Message: ', message.toString())
  client.end()
})