console.log('May Node be with you')

//STEP1
const express = require('express');
const app = express();
//Step6A: mongo client
const MongoClient = require('mongodb').MongoClient
//STEP5A ...
const bodyParser = require('body-parser');
//STEP5B ... BODY PARSER GOES BEFORE ALL OTHER HANDLERS
app.use(bodyParser.urlencoded({extended: true}))
//STEP6B
var db
//STEP 11
app.use(bodyParser.json())
//STEP9:
//making the public folder accessible to the public
app.use(express.static('public'))


//STEP2 : listening to see if the server is connected
// app.listen(3000, function() {
//   console.log('listening on 3000')
// })

//STEP3: READING (.get) the initial page
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

// STEP 4: pulling from the form in index.html, POST pulls from
//         the /quotes action once you click the "submit" button
// app.post('/quotes', (req, res) => {
//     // req.body (name: hi, quote: hi) and all of the posts made
//   console.log(req.body)
// })

//STEP 5: we have to add  BODY PARSER to handle reading data from <form>
  // add the require('body-parser') and app.use it !

//Step6C:
MongoClient.connect('mongodb+srv://demo:demo@cluster0-eyipj.mongodb.net/test?retryWrites=true&w=majority', (err, client) => {
  if (err) return console.log(err)
  db = client.db('star-wars-quotes')
  app.listen(8080, () => {
    console.log('listening on 8080')
  })
})

//STEP 7:
app.post('/quotes', (req, res) => {
  db.collection('quotes').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

// STEP 8:
// INSTALL $ npm install ejs --save
app.set('view engine', 'ejs')
// you always have to make a views folder, and then the folder
// you render goes inside that folder. In our case views --> index.ejs



//STEP10:
// add script tag to EJS

//STEP12:
// add the put method
app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'pokemon'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// STEP 13:
// adding the delete method:
app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
