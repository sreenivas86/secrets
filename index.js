const { urlencoded } = require("body-parser")
const express =require ("express")
const mongoose =require('mongoose')
const encrypt =require("mongoose-encryption")

const app =express()

app.use(urlencoded({extended:true}))
app.use(express.static('public'))
app.set("view engine", 'ejs')
const secret='sreenivas6265'

main().catch(err => console.log(err));
 
async function main() {
    await mongoose.connect("mongodb://0.0.0.0:27017/userDB");
}
const userSchema=mongoose.Schema({
    email:String,
    password:String
})
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})
const User=mongoose.model('user',userSchema)

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post("/register", (req, res) => {

    const newUser=new User({
        email:req.body.username
        ,password:req.body.password
    })
    newUser.save().then(()=>{
        res.render('secrets')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/register')
    })
    
    
});  
   
app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',(req,res)=>{
    
    const username=req.body.username
    const password=req.body.password
    User.findOne({
        email:username
    }).then((user)=>{
        if(user){
            if(user.password ===password){
                res.render('secrets')
            }else{
                console.error('login denied')
            }
        }
    })
    .catch((err)=>{
        console.error(err)
    })
   
app.get('/logout',(req,res)=>{
    res.redirect('/')
})
})
app.listen(8000,()=>{
    console.log("server started on http://localhost:8000/")
})