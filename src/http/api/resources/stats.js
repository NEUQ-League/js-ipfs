'use strict'

const { Transform, Readable } = require('readable-stream')

const transformBandwidth = (stat) => {
  return {
    TotalIn: stat.totalIn,
    TotalOut: stat.totalOut,
    RateIn: stat.rateIn,
    RateOut: stat.rateOut,
  }
}

exports = module.exports

exports.bitswap = require('./bitswap').stat

exports.repo = require('./repo').stat

exports.bw = (request, reply) => {
  const ipfs = request.server.app.ipfs
  const human = request.query.human === 'true'

  const options = {
    peer: request.query.peer,
    proto: request.query.proto,
    poll: request.query.poll === 'true',
    interval: request.query.interval || '1s'
  }

  ipfs.stats.bw(options, (err, res) => {
    if (err) {
      return reply({
        Message: err.toString(),
        Code: 0
      }).code(500)
    }

    if (options.poll) {
      const output = new Transform({
        objectMode: true,
        transform (chunk, encoding, cb) {
          this.push(JSON.stringify(transformBandwidth(chunk)) + '\n')
          cb()
        }
      })

      request.on('disconnect', () => {
        res.destroy()
      })

      res.pipe(output)
      reply(new Readable().wrap(output))
        .header('x-chunked-output', '1')
    } else {
      reply(transformBandwidth(res))
    }
  })
}

