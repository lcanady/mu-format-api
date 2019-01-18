const express = require('express')
const Formatter = require('mu-format')

const formatter = new Formatter({})
const PORT = process.env.PORT || 3001;
const app = express()


app.use(function(err, req, res, next){
  if(err) {
    res.status(500).json({error:err})
  }
})


app.get('/', async (req, res) => {

  // If a request is sent with text, process.
  if (req.query.txt){
    let txt = req.query.txt
    if (txt.match(/github.*/i)){
      txt = txt.replace(/\s/,'')
    }
    try {
      await formatter.format(txt)
      formatter.once('done', documents => {
        res.json({documents})
      })   
      formatter.on('log', log => console.log(log))
      formatter.on('error', error => res.json({error:error.message}))
    } catch (error) {
      res.json({error:error.message})
    }
  } else {
    res.status(500).json({error: 'Txt query parameter required.'})
  }





})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))