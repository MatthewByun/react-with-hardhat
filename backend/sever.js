const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const axios = require('axios')

mongoose.connect('mongodb://localhost:27017/fs07-vexerex', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(`Connected to database successfully `))
  .catch(console.log)

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
