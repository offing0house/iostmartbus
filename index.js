const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const fs = require('fs')

const index = require('./routes/index')
const users = require('./routes/users')
const profile = require('./routes/profile')
const post = require('./routes/post')
const search = require('./routes/search')
const Bus1 = require('./models/bus')
const Document = require('./models/document')
//
const spawn = require('child_process').spawn


// Arduino
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const url = require('url')
// // Use Models
const Mpu6050 = require('./models/mpu6050') 
const db = "mongodb://localhost:27017/usersDB"
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{
    console.log("Mongodb connection is success")
  })
  .catch((err)=>{
    console.log(err)
  });

  

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))


app.post('/hi', (req, res)=>{
  console.log(req.body);
  const mpu6050_value = new Mpu6050(req.body);
  mpu6050_value.save().then(()=>{console.log('driving')});  
  
});

app.get('/star', (req,res) => {
    fs.readFile('./star.png', function(err, data){
        console.log('star.png loading...');
        res.writeHead(200);
        res.write(data);
        res.end();    
    });
})

app.get('/post1' , (req, res)=>{
  const _url = req.url;
  const queryData = url.parse(_url,true).query;
  Bus1.find((err,doc1)=>{
    res.render('post1', {
        doc1: doc1,
        num :queryData.busNum,
    });
  })
})

app.post('/post1/register',(req, res)=>{
      const user_id = 'client';
      const busnum = req.body.busnum;
      const title = req.body.title;
      const main = req.body.main;

      const newDocument = new Document({
         user_id, title, main, busnum
      })
      const net = spawn('python',['app.py',req.file.filename]);
    
      //파이썬 파일 수행 결과를 받아온다
      net.stdout.on('data', function(data) { 
          console.log(data);
          console.log(data.toString());
          if(data.toString() == 'nsfw')
              res.status(200).send('nsfw')
          else
              res.status(200).send('sfw')
      })
      newDocument.save()
      .then(() => {
          //changing
          res.write("<script>alert('success')</script>");
          res.write("<script>window.location=\"/\"</script>");
          
      })
      .catch(err => console.log(err))
  
})

// Passport config
const initializePassport = require('./passport-config')
initializePassport(passport)

// Views in pug
app.set('views', './views')
app.set('view engine', 'pug')

// BodyParser
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'));

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Express flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'),
    res.locals.error_msg = req.flash('error_msg'),
    res.locals.error = req.flash('error'),
    next()
})

// Routes
app.use('/', index)

app.use('/users', users)
app.use('/profile', profile)
app.use('/post', post)
app.use('/search', search)

app.listen(3000, console.log(`Start server on port 3000`))

