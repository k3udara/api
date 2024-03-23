const express= require("express");
const app = express();
const mongoose =require("mongoose")
const User = require('./models/User');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken')
const secret ='asjconowv'
const cookieParser =require('cookie-parser')

const salt = bcrypt.genSaltSync(10);

app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser);

mongoose.connect('mongodb+srv://kxaxuxsxhxaxlxixerox:AlKE8NCaBLuC8XFn@cluster0.p6ljtad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.get('/test',(req,res) =>{
    res.json('test ok');
})


app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
          username,
          password:bcrypt.hashSync(password,salt),
         });
        res.json(userDoc);
      } catch(e) {
        console.log(e);
        res.status(400).json(e);
      }

});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passok = bcrypt.compareSync(password,userDoc.password)
    if (passok){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json({
              id:userDoc._id,
              username,
            });
          });

    }else{
        res.status(400).json('wrong credentials')
    }
});

app.get('/profile', (req,res) =>{
    const{token}= req.cookies;
    jwt.verify(token , secret , {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    })
    

})

app.listen(4001);
console.log("app is succesfully listning 4000")


//mongodb+srv://kxaxuxsxhxaxlxixerox:AlKE8NCaBLuC8XFn@cluster0.p6ljtad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
