const path = require('path')
const fastify = require('fastify')({
    logger: true
})

if (process.env.NODE_ENV !== 'production') {
    fastify.register(require('fastify-cors'))
}

const fastifyStatic = require('fastify-static')
fastify.register(fastifyStatic, {
    root: [path.join(__dirname, 'build'), path.join(__dirname, 'photos')],
    list: true,
    prefixAvoidTrailingSlash: true
})

fastify.listen(process.env.PORT || 5000, '0.0.0.0', (err, address) => {
    if (err) throw err
    fastify.log.info(`Server listening on ${address}`)
})

