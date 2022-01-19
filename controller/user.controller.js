const User = require("../models/user.module.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const validator = require('validator');


// //UPDATE
exports.updateUser = (req, res) => {
    if (req.body.password) {
        let validEmail = validator.isEmail(req.body.email);
        let validPass = validator.isStrongPassword(req.body.password);
        let validPhone = validator.isMobilePhone(req.body.phone, ['ar-EG']);
        if (validEmail && validPass && validPhone) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            .then(sendData => {
                res.status(200).send(sendData)
            })
            .catch(err => {
                res.status(402).send(err)
            })
        } else {
            res.status(405).send("your data is not valid");
        }
    } else {
        let validEmail = validator.isEmail(req.body.email);
        let validPhone = validator.isMobilePhone(req.body.phone, ['ar-EG']);
        if (validEmail && validPhone) {
            User.findByIdAndUpdate(req.params.id, {
                email: req.body.email,
                phone: req.body.phone,
                name: req.body.name
            }, {
                new: true
            })
            .then(sendData => {
                res.status(200).send(sendData)
            })
            .catch(err => {
                res.status(402).send(err)
            })
        } else {
            res.status(405).send("your data is not valid2");
        }
    }
}


exports.checkEmail = (req, res) => {
    User.findOne({ email: req.params.email }, (err, check) => {
        if (err) {
            res.status(405).send({ msg: " error", success: false })
        }
        if (check) {
            res.status(405).send({ msg: "this email is here", success: false })
        }
        else {
            res.status(200).send({ msg: "ok can change email", success: true })
        }
    })
};


//DELETE
exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id).then(data => {
        console.log(data)
        res.status(200).send(data)
    }).catch(err => {
        res.status(400).send(err);
    })

};


//GET USER
exports.getUser = (req, res) => {
    User.findById(req.params.id)
        .then(function (user) {
            res.status(200).send(user);
        })
        .catch(err => res.status(400).send(err))
};


//GET ALL USERS
exports.getAllUsers = (req, res) => {
    User.find({}).then((users) => {
        // console.log(users.length)
        res.send({ success: true, Users: users, NumberOfUsers: users.length })
        // res.send(users)
    })
        .catch(err => res.status(400).send(err))
};

const nodemailer = require('nodemailer');

const message = "Welcome as an Amazon member"

exports.checkForgetPass = (req, res) => {
    User.findOne({ email: req.params.email }, (err, check) => {
        if (err) {
            res.status(200).send({ msg: " error", success: false })
        }
        if (check) {
            console.log(check.name)
            const random = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
            res.status(200).send({ msg: "this email is here", success: true, code: random })
            // ===================================
            const output = `
                <p>You have a contact in Amazon</p>
                <h3>Contact Details</h3>
                <ul>  
                <li>Name: ${check.name}</li>
                <li>Email: ${req.params.email}</li>
                </ul>
                <h3>inter this code :  <b style="color :red;">${random}</b></h3>
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
                to: req.params.email
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
        }
        else {
            res.status(200).send({ msg: "ok can change email", success: false })
        }
    })
};




exports.ChangePass = (req, res) => {
    let validPass = validator.isStrongPassword(req.body.password);
    if (validPass) {
        User.findOneAndUpdate({ email: req.params.email }, {
            password: bcrypt.hashSync(req.body.password, 10),
            realpass: req.body.realpass
        }, {
            new: true
        })
            .then(sendData => {
                res.status(200).send(sendData)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    } else {
        res.status(400).send("your data is not valid");
    }

}



exports.AddUserForAdmin = (req, res, next) => {
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
                        password: bcrypt.hashSync(req.body.password, 10),
                        isSeller: req.body.isSeller,
                        isAdmin: req.body.isAdmin
                    })

                    user.save()
                        .then(data => {
                            res.status(200).send([data, { message: "welcome  you are regitered successfully" }])
                        }).catch(err => {
                            console.log(user)
                            res.status(401).send([err, { message: "the Email in Used " }])
                        })
                }
            }).catch(err => { res.send(err) })
    } else {
        res.status(401).send({ message: "Not valid email or password or phone number please try again.." })
    }
}


exports.getAllUserpagination = async (req, res) => {
    let query;
    let total
    try {
        if (req.body.status === "Users") {
            query = User.find({ $and: [{ isAdmin: false }, { isSeller: false }] });
            total = await User.countDocuments({ $and: [{ isAdmin: false }, { isSeller: false }] });
        } else if (req.body.status === "Admins") {
            query = User.find({ isAdmin: true });
            total = await User.countDocuments({ isAdmin: true });
        } else if (req.body.status === "Seler") {
            query = User.find({ isSeller: true });
            total = await User.countDocuments({ isSeller: true });
        } else {
            query = User.find();
            total = await User.countDocuments();
        }
        // let query = User.find();
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        // const total = await User.countDocuments();

        const pages = Math.ceil(total / pageSize);

        query = query.skip(skip).limit(pageSize);

        if (page > pages) {
            return res.status(404).json({
                status: "fail",
                message: "No page found",
            });
        }

        const result = await query;

        res.status(200).json({
            status: "success",
            count: result.length,
            page,
            pages,
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Server Error",
        });
    }
};