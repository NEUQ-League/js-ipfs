'use strict'

const print = require('../../utils').print

module.exports = {
  command: 'bw',

  describe: 'Get bandwidth information.',

  builder: {
    peer: {
      type: 'string',
      default: ''
    },
    proto: {
      type: 'string',
      default: ''
    },
    poll: {
      type: 'boolean',
      default: false
    },
    interval: {
      type: 'string',
      default: '1s'
    }
  },

  handler (argv) {
    const stream = argv.ipfs.stats.bwReadableStream({
      peer: argv.peer,
      proto: argv.proto,
      poll: argv.poll,
      interval: argv.interval
    })

    stream.once('data', function (stats) {          
      print(`bandwidth status
  total in: ${stats.totalIn}B
  total out: ${stats.totalOut}B
  rate in: ${stats.rateIn}B/s
  rate out: ${stats.rateOut}B/s`)
    })
  }
}
