const express = require('express')
const Formatter = require('mu-format')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const {promisify} = require('util')
const package = require('./package.json')

const readFilePromise = promisify(fs.readFile)

const PORT = process.env.PORT || 3001;
const app = express()

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())


app.get('/', (req, res) => {
  res.send({
    version: package.version,
    status:'200',
    message:'Welcome to the mu-format API!'
  })
})

app.post('/', async (req, res) => {
  
  const formatter = new Formatter({
    headers: 'system author email url'
  })

  if (req.body.url) {
    try {
      await formatter.format(req.body.url); 
    } catch (error) {
      res.send({title: 'Error', message: error.message})
    }
    formatter.on('done', docs => res.send({documents: docs}))
    formatter.on('error', error => res.send({
      title: 'Error', 
      message: error.message
    }))
  } else if (req.body.txt) {
    formatter.on('done', docs => res.send({documents: docs}))
    formatter.on('error', error => res.send({error: error.message}))

    formatter.format(req.body.txt);

  } else if (req.body.file) {
    try {
      const file = await readFilePromise('./'+req.body.file)
      res.send({file: file.toString('utf8')})
    } catch (error) {
      res.send({title:'Error', message:error.message})
    }
  } else {
    res.send({title:'Unknown Request', message:'Unknown request sent.'})
  }

})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))