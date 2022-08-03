//go to the json file and put dev as nodemon src/app.js -e js,hbs so that server update with save file
//to run dev write npm run dev in terminal
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');

const It = require('./models/It');
const port = process.env.PORT || 8000;

require('./db/conn');
// setting the path
const staticpath = path.join(__dirname, '../public');
const viewscpath = path.join(__dirname, '../templates/views');
const partialscpath = path.join(__dirname, '../templates/partials');
// console.log(staticpath);

// link bootstrap and jquery in app.js (middlewar)
app.use(
  '/css',
  express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js'))
);
app.use(
  '/jq',
  express.static(path.join(__dirname, '../node_modules/jquery/dist'))
);

app.use(express.static(staticpath));
app.use(express.json());
app.use(express.urlencoded({ entended: false }));

// use tamplete engine handle bar
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('views', viewscpath);
hbs.registerPartials(partialscpath);

// routing
// app.get(path,callback)
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/cart', (req, res) => {
  res.render('cart');
});
app.get('/mail', (req, res) => {
  res.render('mail');
});

app.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password == cpassword) {
      const Techservice = new It({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        password: password,
        confirmpassword: cpassword,
      });

      const Registerd = await Techservice.save();
      res.status(201).render('index');
    } else {
      res.send('password not matching');
    }
  } catch (error) {
    res.status(404).send(error);
  }
});
app.post('/mail', async (req, res) => {
  try {
    const mail = req.body.email;
    const useremail = await It.findOne({ email: mail });
    if (mail == useremail.email) {
      var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'campusquest30@gmail.com',
          pass: 'zexsnicaqnwavjht'
        }
      });

      var mailOptions = {
        from: 'campusquest30@gmail.com',
        to: mail,
        subject: 'Sending Email using Node.js',
        text: `Hi Smartherd, thank you for your nice Node.js tutorials.
          I will donate 50$ for this course. Please send me payment options.`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).render('index');
    } else {
      res.send('Login First');
    }
  } catch (e) {
    res.status(404).send(error);
  }
})
// login check
// if we use async then along with we use try catch for error detection
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await It.findOne({ email: email });
    // res.send(useremail);
    // console.log(useremail.password);
    if (password == useremail.password) {
      res.status(200).render('index');
    } else {
      res.send('Invalid User Details');
    }
  } catch (error) {
    res.status(400).send('Invalid User Details');
  }
});
// server create
app.listen(port, () => {
  console.log(`${port} h ye hamra`);
});
