import fastify from 'fastify'
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

app.listen({ port: 5173 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Client server listening at ${address}`)
})