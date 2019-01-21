const express = require('express')
const Formatter = require('mu-format')
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = process.env.PORT || 3001;
const app = express()

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())


app.get('/', (req, res) => {
  res.send({
    status:'200',
    message:'Welcome to the mu-format API!'
  })
})

app.post('/', async (req,res) => {
  
  const formatter = new Formatter({
    headers: 'system author email url'
  })

  // if a URL is provided.
  if (req.body.url) {
    try {
      await formatter.format(req.body.url); 
    } catch (error) {
      res.send({title: 'Error', message: error.message})
    }
    formatter.once('done', docs => res.send({documents: docs}))
    formatter.once('error', error => res.send({
      title: 'Error', 
      message: error.message
    }))  
  // Else just parse the text.
  } else {
    if (req.body.txt){
      try {
        await formatter.format(req.body.txt); 
      } catch (error) {
        res.send({title: 'Error', message: error.message})
      }
      formatter.once('done', docs => res.send({documents: docs}))
      formatter.on('error', error => res.send({error: error.message}))
    } else {
      res.send({title: 'Error', message:'Text required.'})
    } 
  }
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))