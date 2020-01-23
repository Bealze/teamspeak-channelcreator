const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const helmet = require('helmet')
const config = require('../nuxt.config.js')
const api = require('./routes/api')
const app = express()

// Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

app.use(express.json())

// API Routes
app.use('/api', api)

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Cors, Helmet & Rate Limiter
  app.use(helmet())

  // Listen the server
  app.listen(port, host)
}
start()
