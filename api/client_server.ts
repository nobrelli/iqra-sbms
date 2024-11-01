// Vercel serverless function

import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyStatic from '@fastify/static'
import * as path from 'node:path'

const app = fastify({
    logger: true
})

app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'client', 'dist'),
    wildcard: false
})

app.get('/*', async (request, reply) => {
    return reply.sendFile('index.html')
})

// For testing
//
// app.listen({ port: 8080 }, (err, address) => {
//     if (err) {
//         console.error(err)
//         process.exit(1)
//     }
//     console.log(`Server listening at ${address}`)
// })

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
    await app.ready()
    app.server.emit('request', request, reply)
}

export default handler