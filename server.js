const path = require('path')
const fastify = require('fastify')({
    logger: true
})

if (process.env.NODE_ENV !== 'production') {
    fastify.register(require('fastify-cors'))
}

const fastifyStatic = require('fastify-static')
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'build'),
    prefixAvoidTrailingSlash: true
})

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'photos'),
    list: true,
    decorateReply: false,
    prefix: '/private/',
})

fastify.addHook('preHandler', (request, reply, done) => {
    console.log('/' + request.headers['authorization'] + '/')
    console.log('/' + process.env.PRIVATE_KEY + '/')
    if (
        request.url.includes('private') && 
        !request.url.endsWith('.png') && !request.url.endsWith('.jpg') && 
        request.headers['authorization'] !== process.env.PRIVATE_KEY
    ) {
        reply.code(401).send({ code: '401', error: 'Unauthorized', message: 'You must authenticate' })
        return reply
    } else {
        done()
    }
})

fastify.listen(process.env.PORT || 5000, '0.0.0.0', (err, address) => {
    if (err) throw err
    fastify.log.info(`Server listening on ${address}`)
})

