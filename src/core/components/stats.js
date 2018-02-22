'use strict'

const promisify = require('promisify-es6')
const Big = require('big.js')

function bandwidthStats (self, opts) {
  return new Promise((resolve, reject) => {
    resolve({
      totalIn: new Big(0),
      totalOut: new Big(0),
      rateIn: new Big(0),
      rateOut:new Big(0)
    })
  })
}

module.exports = function stats (self) {
  return {
    bitswap: require('./bitswap')(self).stat,
    repo: require('./repo')(self).stat,
    bw: promisify((opts, callback) => {
      bandwidthStats(self, opts)
        .then((stats) => callback(null, stats))
        .catch((err) => callback(err))
    }),
    bwReadableStream: (opts) => {
      if (opts.poll) {

      }
    },
    bwPullStream: (opts) => {

    }
  }
}
