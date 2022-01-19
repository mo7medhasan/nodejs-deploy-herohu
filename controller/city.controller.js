const City = require("../models/city.module.js");

exports.addCity = (req, res) => {
    City.findOne({ name: req.body.name }, (err, cityAlreadyExisted) => {
        if (err) { res.status(200).send(err) };
        if (cityAlreadyExisted) {
            res.status(403).json({ error: "This City is already existed" });
        } else {
            const newCity = City({
                name: req.body.name,
                governateName: req.body.governateName,
                arName: req.body.arName,
                arGovernateName: req.body.arGovernateName
            })
            newCity.save().then((savedCity) => {
                res.status(200).send(savedCity)
            }).catch((err => {
                res.status(401).send(err)
            }))
        }
    })
}
exports.getCitiesByGovName = (req, res) => {
    if(req.headers.lang == 'ar') {
        City.find({ arGovernateName: req.params.GovName }, {arName:1},(err, cities) => {
            if (err) { res.status(200).send(err) };
            {
                res.status(200).send(cities)
            }
        })
    }else{
        City.find({ governateName: req.params.GovName }, {name:1},(err, cities) => {
            if (err) { res.status(200).send(err) };
            {
                res.status(200).send(cities)
            }
        })
    }
    
}

exports.getcetybyid =(req, res) => {
    City.findById(req.params.id)
    .then(function (City) {
    console.log("lelo")

        res.status(200).send(City);
    })
    .catch(err=>res.status(400).send([err,{message:"something wrong"}]))  
};


exports.GetAllCities = (req, res) => {
    City.find({}).then(function(City) {
            res.send(City);
        })
        .catch(err => {
            res.status(402).send({message:"something wrong"})
        })
}


exports.deletecities = async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id);
        res.status(200).send("City has been deleted...");
    } catch (err) {
        res.status(500).json({message:"something wrong"});
    }
};

exports.updateCitie = (req, res) => {
    City.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            .then(sendData => {
                res.status(200).send(sendData)
            })
            .catch(err => {
                res.status(402).send({message:"something wrong"})
            })      
  
}


exports.getAllCitypagination = async (req, res) => {
    try {
        let query = City.find();

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await City.countDocuments();

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