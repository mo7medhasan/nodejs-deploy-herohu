const User = require("../models/user.module.js");
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const MultipleFile = require('../models/multiplefile.module');
const SingleFile = require('../models/singlefile.module');

const message="Welcome as an Amazon member";
//SIGN UP 
exports.signUp = (req, res, next) => {
    let validEmail = validator.isEmail(req.body.email);
    let validPass = validator.isStrongPassword(req.body.password);
    let validPhone = validator.isMobilePhone(req.body.phone, ['ar-EG']);
    if (validEmail && validPass && validPhone) {
        console.log(req.body)
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user)
                    res.status(404).send('please try again')
                else {
                    console.log("data")
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: bcrypt.hashSync(req.body.password, 10)
                    })
                    
                    user.save()
                        .then(data => {
                            res.status(200).send([data, { message: "welcome  you are regitered successfully" }])
                            // ===================================
                            const output = `
                        <p>You have a new contact request</p>
                        <h3>Contact Details</h3>
                        <ul>  
                        <li>Name: ${req.body.name}</li>
                        <li>Phone: ${req.body.phone}</li>
                        </ul>
                        <h3>Message</h3>
                        <p style="color :red;">${message}</p>
                                            `;
                            let transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "amazon.mern@gmail.com",
                                    pass: "Amazon@123"
                                }, tls: {
                                    rejectUnauthorized: false,
                                }
                            })
                            let mailOptions = {
                                from: "amazon.mern@gmail.com",
                                to: req.body.email
                                , subject: "Welcome you in Amazon"
                                , text: "Welcome to amazon"
                                , html: output
                            }
                            transporter
                                .sendMail(mailOptions)
                                .then((res) => {
                                    console.log("Email sent successfully!!!", res);
                                }).catch((err) => {
                                    console.log(err);
                                });
                            // =========================================
                        }).catch(err => {
                            console.log(user)
                            res.status(401).send([err, { message: "the Email in Used " }])
                        })
                }
            }).catch(err => {res.send(err)})
    } else {
        res.status(401).send({ message: "Not valid email or password or phone number please try again.." })
    }
}


// LOGIN
exports.login = (req, res) => {
    User.findOne({ email: req.body.email},
    function (err, user) {
        if (err) {
            return res.status(500).send("serever error");
        } 
        !user && res.status(401).json("Wrong User Email or Password..");
        
        if(!bcrypt.compareSync(req.body.password,user.password)) {
            return res.status(401).send("Wrong Password or Email..");
        }
        if (!user.isAdmin) {
            const userToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin,
                name: user.name ,email: user.email}, 
                process.env.JWT_SEC, { expiresIn: "3d" });
            jwt.verify(userToken, process.env.JWT_SEC, (err, userData) => {
                if (userData) {
                    console.log(userData)
                    res.status(200).send({ sucess: true, token: userToken, user: user });
                }
            })
        }else{
            res.status(401).json("You'r not authenticated... ")
        }
    })
};


//for admin
exports.adminLogin = (req, res) => {
    // console.log("admin..", req.body);
    User.findOne({ email: req.body.email }, 
    function (err, user) {
        // console.log(user)
        if (err) {
            return res.status(500).send("serever error");
        }
        if(!user){
            return  res.status(401).json("Wrong User Email or Password")             
        }
        
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(404).json("Wrong User Email or Password...")
        }
        
        if (user.isAdmin) {
            console.log(user.isAdmin)
            const userToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin, name: user.name }, process.env.JWT_SEC, { expiresIn: "3d" });
            jwt.verify(userToken, process.env.JWT_SEC, (err, userData) => {
                if (userData) {
                    return res.status(200).send({ sucess: true, token: userToken, user: user });
                }
            })
        }else{
            return res.status(403).send({error:"you are not allowed..."})
        }
    })
};


//LOGOUT
exports.logout = (req, res) => {
    if (req.headers["authorization"] !== undefined) {
        req.headers["authorization"] = undefined
        console.log("in logout")
    } else {
        res.status(200).send("not found")
    }
    // const authHeader = req.headers["authorization"];
    // jwt.verify(authHeader, process.env.JWT_SEC, (err, data) => {
    //     User.findOne({ email: data.id })
    // })
    console.log("finish logout...", req.headers["authorization"])
}


///SELLER SIGNUP
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}


exports.sellerSignUp = (req, res, next) => {
    
    console.log(req.body)
    let validEmail = validator.isEmail(req.body.email);
    let validPass = validator.isStrongPassword(req.body.password);
    let validPhone = validator.isMobilePhone(req.body.phone, ['ar-EG']);
    if (validEmail && validPass && validPhone) {
        console.log(req.body)
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user)
                    res.status(404).send('please try again.')
                else {
                    console.log("data")
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: bcrypt.hashSync(req.body.password, 10),
                        isSeller:true,
                        shop:req.body.shop
                        // shop:{
                        //     shopName:req.body.shopName,
                        //     logo:filesPath,
                        //     description:req.body.description
                        // }
                    })
                    user.save()
                        .then(data => {
                            res.status(200).send([data, { message: "welcome  you are regitered successfully" }])
                            // ===================================
                            const output = `
                        <p>You have a new contact request</p>
                        <h3>Contact Details</h3>
                        <ul>  
                        <li>Name: ${req.body.name}</li>
                        <li>Phone: ${req.body.phone}</li>
                        <li>Shop Name: ${req.body.shop}</li>
                        </ul>
                        <h3>Message</h3>
                        <p style="color :red;">${message}</p>
                                            `;
                            let transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "amazon.mern@gmail.com",
                                    pass: "Amazon@123"
                                }, tls: {
                                    rejectUnauthorized: false,
                                }
                            })
                            let mailOptions = {
                                from: "amazon.mern@gmail.com",
                                to: req.body.email
                                , subject: "Welcome you in Amazon"
                                , text: "Welcome to amazon as a seller , now you can sell your product on our website"
                                , html: output
                            }
                            transporter
                                .sendMail(mailOptions)
                                .then((res) => {
                                    console.log("Email sent successfully!!!", res);
                                }).catch((err) => {
                                    console.log(err);
                                });
                            // =========================================
                        }).catch(err => {
                            console.log(user)
                            res.status(401).send([err, { message: "the Email is Used " }])
                        })
                }
            }).catch(err => {res.send(err)})
    } else {
        res.status(401).send({ message: "Not valid email or password or phone number please try again.." })
    }
}


///SELLER SIGNIN
exports.sellerLogin = (req, res) => {
    console.log("seller..", req.body);
    User.findOne({ email: req.body.email }, 
    function (err, user) {
        // console.log(user)
        if (err) {
            return res.status(500).send("serever error");
        }
        if(!user){
            return  res.status(401).json("Wrong User Email or Password")             
        }
        
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(404).json("Wrong User Email or Password...")
        }
        
        if (user.isSeller) {
            const userToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin, name: user.name }, process.env.JWT_SEC, { expiresIn: "3d" });
            jwt.verify(userToken, process.env.JWT_SEC, (err, userData) => {
                if (userData) {
                    return res.status(200).send({ sucess: true, token: userToken, user: user });
                }
            })
        }else{
            return res.status(403).send({error:"you are not allowed..."})
        }
    })
};


//GOOGLE CRADENTIALS
exports.googleSignUp = (req, res, next) => {
    console.log("googleSignUp",req.body)
    let validEmail = validator.isEmail(req.body.email);
    if (validEmail) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user)
                    res.status(200).send({message:'user is exist'})
                else {
                    console.log("data")
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        sotialInfo: {
                            google: req.body.email
                        }
                    })
                    user.save()
                        .then(data => {
                            res.status(200).send([data, { message: "welcome  you are regitered successfully" }])
                        }).catch(err => {
                            console.log(user)
                            res.status(401).send([err, { message: "the Email in Used " }])
                        })
                }
            }).catch(err => {res.send(err)})
    } else {
        res.status(401).send({ message: "Not valid email or password or phone number please try again.." })
    }
}


exports.googleLogin = (req, res) => {
    console.log("googleLogin",req.body)
    User.findOne({ email: req.body.email},
    function (err, user) {
        if (err) {
            return res.status(500).send("serever error");
        } 
        !user && res.status(401).json("Wrong Credentials...");
            const userToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin,
                name: user.name ,email: user.email}, 
                process.env.JWT_SEC, { expiresIn: "3d" });
            jwt.verify(userToken, process.env.JWT_SEC, (err, userData) => {
                if (userData) {
                    console.log(userData)
                    res.status(200).send({ sucess: true, token: userToken, user: user });
                }
            })
            console.log(user)
    })
};