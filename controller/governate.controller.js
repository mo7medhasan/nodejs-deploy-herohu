const Governate = require("../models/governate.module.js");

exports.addGovernate = (req, res) => {
    Governate.findOne({ name: req.body.name }, (err, govAlreadyExisted) => {
        if (err) { res.status(200).send(err) };
        if (govAlreadyExisted) {
            res.status(403).json({ error: "This Gov is already existed" });
        } else {
            const newGov = Governate({
                name: req.body.name,
                ctryName: req.body.ctryName,
                arName: req.body.arName,
                arCtryName: req.body.arCtryName
            })
            newGov.save().then((savedGov) => {
                res.status(200).send(savedGov)
            }).catch((err => {
                res.status(401).send(err)
            }))
        }
    })
}
exports.getGovByCtryName = (req, res) => {
    if(req.headers.lang == 'ar') {
        Governate.find({ arCtryName: req.params.ctryName }, {arName:1},(err, Govs) => {
            if (err) { res.status(200).send(err) };
            {
                res.status(200).send(Govs)
            }
        })
    }else{
        Governate.find({ ctryName: req.params.ctryName }, {name:1},(err, Govs) => {
            if (err) { res.status(200).send(err) };
            {
                res.status(200).send(Govs)
            }
        })
    }
}
exports.getGovByName = (req, res) => {
    console.log("---------")
    if(req.user.isAdmin){
        Governate.findOne({name: req.params.name},(err, gov) => {
            if (err) { res.status(404).send(err) };
            {
                res.status(200).send(gov);
            }
        })
    }else{
        if(req.headers.lang == 'ar') {
            Governate.findOne({arName: req.params.name}, {arName:1},(err, gov) => {
                if (err) { res.status(404).send(err) };
                {
                    res.status(200).send(gov);
                }
            })
        }else{
            Governate.findOne({name: req.params.name}, {name:1},(err, gov) => {
                if (err) { res.status(404).send(err) };
                {
                    res.status(200).send(gov)
                }
            })
        }
    }
    
}

exports.GetAllGovernate=(req, res) => {
    Governate.find({})
    .then((Governate)=>{
        // console.log("Governate",Governate)
        res.send(Governate)
    })
    .catch(err=>res.status(400).send(err))    
};

exports.deletegove = async (req, res) => {
    try {
        await Governate.findByIdAndDelete(req.params.id);
        res.status(200).send("Governate has been deleted...");
    } catch (err) {
        res.status(500).json({message:"something wrong"});
    }
};

exports.updategove = (req, res) => {
    Governate.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        ctryName: req.body.ctryName,
        arName: req.body.arName,
        arCtryName: req.body.arCtryName
            }, {
                new: true
            }).then(data=>{
                res.status(200).send(data)
            })
            .catch(err=>res.status(400).send(err))
}

exports.getAllGovernatepagination = async (req, res) => {
    try {
        let query = Governate.find();

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Governate.countDocuments();

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