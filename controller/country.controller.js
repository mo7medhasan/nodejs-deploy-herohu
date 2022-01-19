const Country = require("../models/country.module.js");

exports.addCountry = (req, res) => {
    console.log(req.body)
        Country.findOne({ name: req.body.name ,arName: req.body.arName }, (err, ctryAlreadyExisted) => {
            if (err) { res.status(200).send(err) };
            if (ctryAlreadyExisted) {
                res.status(403).json({ error: "This Country is already existed" });
            } else {
                const newCtry = Country({
                    name: req.body.name,
                    arName: req.body.arName
                })
                newCtry.save().then((savedCtry) => {
                    res.status(200).send(savedCtry)
                }).catch((err => {
                    console.log("gggggg3")
                    res.status(404).send(err)
                }))
            }
        })
}

exports.getCountries = (req, res) => {
    if(req.user.isAdmin){
        Country.find({ },(err,countries) => {
            if(countries){
                res.status(200).send(countries)
            }else{
                res.status(401).send({message:"there's somthing wrong...."})
            }
        })
    }else{
        console.log(req.headers.lang )
    if(req.headers.lang == 'ar') {
        Country.find({ }, {arName:1},(err,countries) => {
            console.log(countries)
            if(countries){
                res.status(200).send(countries)
            }else{
                res.status(401).send({message:"there's somthing wrong...."})
            }
        })
    }else{
        const countries = Country.find({ }, {name:1},(err,countries) => {
            console.log(countries)
            if(countries){
                res.status(200).send(countries)
            }else{
                res.status(401).send({message:"there's somthing wrong...."})
            }
        })
    }
    }
    
}

exports.getCountry = (req, res) => {
    if(req.user.isAdmin){
        console.log("getCountry",req.params.id )
        Country.findOne({_id: req.params.id}, (err, country) => {
            if (err) { res.status(200).send(err) };
            {
                res.status(200).send(country)
            }
        })
    }else{
        if(req.headers.lang == 'ar') {
            Country.findOne({arName: req.params.name}, (err, country) => {
                if (err) { res.status(200).send(err) };
                {
                    res.status(200).send({"country":country})
                }
            })
        }else{
            Country.findOne({name: req.params.name}, (err, country) => {
                if (err) { res.status(200).send(err) };
                {
                    res.status(200).send({"country":country})
                }
            })
        }
    }
}

exports.deleteCountry = async (req, res) => {
    try {
        await Country.findByIdAndDelete(req.params.Id);
        res.status(200).json("Country has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.updateCountry = (req, res) => {
    console.log(req.body)
    Country.findByIdAndUpdate(req.params.Id, {
            $set: req.body,
        }, { new: true })
        .then(cat => {
            console.log(cat)
            res.status(200).send(cat)
        })
}


exports.getAllCountrypagination = async (req, res) => {
    try {
        let query = Country.find();

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Country.countDocuments();

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


