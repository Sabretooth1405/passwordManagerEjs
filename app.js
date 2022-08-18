//jshint esversion:8
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/usersDB');

}
let username = "";
let passwd = "";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose.model('User', userSchema);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/signup.html', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/signup.html', function (req, res) {
    username = req.body.username;
    passwd = req.body.passwd;
    let rPaswd = req.body.rPasswd;
    if (passwd === rPaswd) {
        User.find({ name: username }, function (err, doc) {
            if (err) {
                console.log(err);
                res.redirect('back');

            }
            else if (doc.length !== 0) {
                console.log("Username is already taken");
                res.redirect('back');

            }
            else {
                const user = new User({
                    username: username,
                    password: passwd
                });
                user.save();
                res.redirect('/');
            }
        });
    }
    else {
        res.redirect('back');
    }

});
app.post('/',function(req,res){
    let entUsername=req.body.username;
    let entPasswd=req.body.passwd;
    User.find({username:entUsername,password:entPasswd},function(err,doc){
        if(err)
        {
            console.log(err);
            res.redirect('/');
        }
        else if(doc.length===0){
            console.log("invalid username or password");
            res.redirect('/');
        }
        else{
            res.send(`Welcome ${entUsername}`);
            mongoose.connection.close()
        }
    });
});
app.listen(3000, function () {
    console.log('Serving on port 3000...');
});