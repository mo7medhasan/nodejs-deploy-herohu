const Address = require("../models/address.module.js");

exports.addAddress = (req, res) => {
    console.log("&&&&&&&",req.user)
    const newAddress = new Address({
        userId: req.user.id,
        country: req.body.country,
        city: req.body.city,
        governate: req.body.governate,
        isdefault:req.body.isdefault
    })
    newAddress.save().then((address) => {
        res.status(200).send(address)
    }).catch((err => {
        res.status(401).send(err)
    }))
}


exports.getAddresses = (req, res) => {
    Address.find({ userId: req.user.id })
    .populate('userId')
    .then(address=>{
        res.status(200).send(address)
    })
    .catch(error => {
        res.status(400).send(err)
    })
}

exports.EditAddress = (req, res) => {
    Address.findByIdAndUpdate(req.params.id, {
        $set:req.body
    }, { new: true })
    .then(address => {
        res.status(200).send(address)
    }).catch((err) => {
        res.status(400).send(err)
    })

}


exports.defaultAddress = (req, res) => {
    // Address.findByIdAndUpdate(req.params.id, {
    //     $set:{isdefault:true}
    // }, { new: true })
    // .then(address => {
    //     res.status(200).send(address)
    // }).catch((err) => {
    //     res.status(400).send(err)
    // })
    Address.updateMany({userId:req.user.id}, {
        $set:{isdefault:false}
    }, { new: true })
    .then(address => {
        Address.findByIdAndUpdate(req.params.id, {
        $set:{isdefault:true}
        }, { new: true })
        .then(address => {
            res.status(200).send(address)
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        res.status(400).send(err)
    })

}


exports.deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json("Address has been deleted...");
    } catch (err) {
        res.status(400).json(err);
    }
};


exports.getAddress = (req, res) => {
    Address.findOne({_id:req.params.id})
    .then(address=>{
        res.status(200).send(address)
    })
    .catch(error => {
        res.status(400).send(err)
    })
}

exports.getDefaultAddress = (req, res) => {
    console.log("==========")
    Address.find({isdefault:true,userId:req.user.id}).sort({createdAt:-1}).limit(1)
    .populate('userId')
    .then(address=>{
        console.log("#####",address)
        res.status(200).send(address[0])
    })
    .catch(error => {
        res.status(400).send(err)
    })
}


exports.getAddressesByAdmin = (req, res) => {
    Address.find({ userId: req.params.id })
    .populate('userId')
    .then(address=>{
        res.status(200).send(address)
    })
    .catch(error => {
        res.status(400).send(err)
    })
}

exports.addAddressByAdmin = (req, res) => {

 try{  
    
    console.log("ksdfghjk");
    const newAddress = new Address({
        userId: req.params.id,
        country: req.body.country,
        city: req.body.city,
        governate: req.body.governate,
        isdefault:req.body.isdefault
    })
    newAddress.save().then((address) => {console.log("sdfgjge");
        res.status(200).send(address)
    }).catch((err => {
        res.status(401).send(err)
    }))
} catch(err)
{
    res.status(402).send(err)
}
}