const Product = require("../models/product.module.js");
const Order = require("../models/order.module.js");
const MultipleFile = require('../models/multiplefile.module');
const ElecModel = require("../models/productModel.module");
const User = require("../models/user.module.js");
const Commission = require("../models/commission.module.js");

const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}






//GET SELLERS FROM DB
exports.getAllSellers = (req, res) => {
    User.find({ isSeller: true }).then((sellers) => {
        res.send(sellers)
    })
        .catch(err => res.status(400).send(err))
};



// ORDER
exports.getsellerOrders = (req, res) => {
    console.log(req.params.id)
    const findQuery = [
        { $unwind: "$orderItems" },
        { $match: { "orderItems.sellerId": req.params.id } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$_id", orderItems: { $push: "$orderItems" } } },
    ];
    Order.aggregate(findQuery).exec(function (err, order) {
        if (err) res.send(err);
        res.status(200).send(order)
    })
}



exports.getAdminOrders = (req, res) => {
    const findQuery = [
        { $unwind: "$orderItems" },
        { $match: { "orderItems.sellerId": req.user.id } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$_id", orderItems: { $push: "$orderItems" } } }
    ];
    Order.aggregate(findQuery).exec(function (err, order) {
        if (err) res.send(err);
        res.status(200).send(order)
    })
    //////////////////////
    // let arr = []
    // Order.find({orderItems:{$elemMatch:{sellerId:req.user.id}}}).sort({ createdAt: -1 }).limit(5)
    //     // .populate('orderItems.productId')
    //     .exec(function (err, order) {
    //         if (err) res.send(err);
    //         res.status(200).send(order)
    //     })
    /////////////////////
    // Order.find({}).sort({ createdAt: -1 })
    // .populate("orderItems.productId")
    // .find({orderItems:{$elemMatch:{sellerId:req.user.id}}})
    // .exec(function (err, order){
    //     if (err) res.send(err);
    //     let allSellerOrderedProducts = [];
    //     let totalPriceOfOrder = [];
    //     let pricePerProduct;
    //     order.forEach((i)=>{
    //         var pOfSeller = i.orderItems.find((p)=> p.productId.sellerId.toString()==req.user.id)
    //         allSellerOrderedProducts.push(pOfSeller);
    //         pricePerProduct = pOfSeller.price * pOfSeller.quantity
    //         totalPriceOfOrder.push(pricePerProduct)
    //     });
    //     const sum = totalPriceOfOrder.reduce((a,b)=> a+b)
    //     res.status(200).send({totalIncome:sum,orders:allSellerOrderedProducts})
    // })
}



/////////////// FOR PRODUCT
exports.createProduct = (req, res) => {
    console.log(req.body, "uuuuuuuuu")
    const filesPath = [];
    const filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
        filesPath.push(element.path);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray
    });
    multipleFiles.save();
    const productAlreadyExists = Product.findOne({ name: req.name })
    if (productAlreadyExists.name) {
        console.log("filesPath")

        res.status(404).send({ message: "Product already exists" });
    } else {
        // console.log(
        //     req.body.model)
        console.log(req.headers)
        const totalprice = req.body.price - (req.body.price * req.body.discount / 100)
        const newProduct = new Product(
            {
                name: req.body.name,
                arname: req.body.arname,//
                sellerId: req.user.id,
                imagePath: filesPath,//
                brand: req.body.brand,
                category: req.body.category,
                arcategory: req.body.arcategory,//
                subcategory: req.body.subcategory,
                arsubcategory: req.body.arsubcategory,//
                description: req.body.description,
                ardescription: req.body.ardescription,//
                countInStock: req.body.countInStock,
                ModelId: req.body.modelid,
                price: req.body.price,
                priceafterdiscount: totalprice,
                discount: req.body.discount,
                reviews: []
            }
        )
        console.log(newProduct, "sssss")
        newProduct.save().then((savedProduct) => {
            // console.log(req.body,"sssss")
            res.status(200).send(savedProduct);
        }).catch((err) => {
            res.status(401).send({ message: "something wrong" })
        })
    }
}

exports.AddmodelElec = (req, res) => {
    const newmodelProduct = new ElecModel(
        {
            model: req.body.model
        }
    )
    newmodelProduct.save().then((savedmodelProduct) => {
        res.status(200).send(savedmodelProduct);
    }).catch((err) => {
        res.status(401).send({ message: "something wrong" })
    })
}


exports.ubdateModel = (req, res) => {
    console.log("bnbnb")
    ElecModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    })
        .then(sendData => {
            res.status(200).send(sendData)
        })
        .catch(err => {
            res.status(402).send({ message: "something wrong" })
        })
}


exports.getProductSeller = (req, res, next) => {
    Product.find({ sellerId: req.user.id }, function (err, product) {
        if (err) res.status(400).send({ message: "something wrong" });
        res.status(200).send(product);
    });


}


exports.deleteProductSeler = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.getProductdetails = (req, res, next) => {

    Product.findOne({ _id: req.params.id }, function (err, product) {
        if (err) res.status(400).send({ message: "something wrong" });
        // console.log("Product",product)
        res.status(200).send(product);
    });
}

exports.updateProduct = (req, res) => {
    const filesPath = [];
    const filesArray = [];
    console.log(req.files)
    req.files.forEach(element => {
        const file = {
            fileName: element.name,
            filePath: element.path,
            fileType: element.type,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        // console.log(file)
        filesArray.push(file);
        filesPath.push(element.path);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray
    });
    multipleFiles.save();
    var totalprice = req.body.price - (req.body.price * req.body.discount / 100)
    Product.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            arname: req.body.arname,//
            sellerId: req.user.id,
            imagePath: filesPath,
            brand: req.body.brand,
            category: req.body.category,
            arcategory: req.body.arcategory,//
            subcategory: req.body.subcategory,
            arsubcategory: req.body.arsubcategory,//
            description: req.body.description,
            ardescription: req.body.ardescription,//
            price: req.body.price,
            ModelId: req.body.modelid,
            priceafterdiscount: totalprice,
            discount: req.body.discount,
            countInStock: req.body.countInStock
        }
    },
        { new: true })
        .then(prd => {
            res.status(200).send(prd)
        }).catch((err) => {
            res.status(401).send({ message: "something wrong" })
        })
}



exports.getProductReviews = (req, res) => {
    Product.findById(req.params.productId).then((rev) => {
        res.send(rev.reviews)
        res.status(200).json({
            success: true,
            prd: pro
        });
    }).catch(err => res.status(400).send(err));

    let avg = 0;
    Product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    let ratings = 0;
    if (Product.reviews.length === 0) {
        Product.ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }
}


exports.deleteReview = (req, res, next) => {
    Product.findOneAndUpdate({ _id: req.params.productId },
        { $pull: { reviews: { _id: req.params.reviewId } } },
        { new: true }).then((delrev) => {
            let n = 0
            let c = 0
            if (delrev) {
                console.log(req.params.reviewId, req.params.productId)
                console.log("lllll")
                delrev.reviews.forEach(ret => {
                    n += ret.rating;
                    c++
                })
                delrev.ratings = n / c
                delrev.numReviews = c

            }
            delrev.save()
            res.status(200).send(delrev);
        }).catch((err) => {
            res.status(400).send(err)
        })
}


exports.getAdminsingleOrders = (req, res) => {
    console.log("kk")
    const findQuery = [
        { $unwind: "$orderItems" },
        { $match: { "orderItems.sellerId": req.user.id } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$_id", orderItems: { $push: "$orderItems" } } }
    ];
    Order.aggregate(findQuery).exec(function (err, order) {
        let result
        order.forEach((so) => {
            if (so._id == req.params.id) {
                result = so
            }

        })
        if (err) res.send(err);
        res.status(200).send(result)
    })
}


///GET TOTAL FOR SELLER AFTER DILEVIRED ORDERS

exports.getTotalForDeliveredOrders = (req, res) => {
    console.log(req.body)
    
    const findQuery = [
        {$unwind: "$orderItems" },
        {$match: {"orderItems.sellerId":req.user.id,"isDelivered":true } },
        { $sort : { createdAt: -1 } },
        {$group: {_id: "$_id", orderItems: {$push: "$orderItems"} 
                ,total:{ 
                    $sum:{ $multiply:['$orderItems.price','$orderItems.quantity']
                    }
                }
            }
        },
        // group by null --> to sum the out field total for all orders not for each order
        { $group: { _id:"$_id", totalInEachOrder: {$push:"$total"} ,totalIncome: {$sum :'$total'} }  }
        ,{$project: {totalInEachOrder:1,totalIncome:1 }}
    ];
    // console.log(req.user.id)
    Order.aggregate(findQuery).exec(function (err, order) {
        // console.log(order)
        if (err) res.send(err);
        res.status(200).send(order)
    })
}


///CALCULATE COMMISSION
exports.commissionForEachSeller = (req, res) => {
    console.log("!!!!!!!",req.body.items)
    Commission.findOne({ userId: req.user.id }, (err, commission) => {
        if (err) { res.status(400).send(err) }
        if (commission) {
            Commission.findOneAndUpdate({ "userId": req.user.id }, {
                    "$set": {
                        sellerId:req.user.id,
                        commission:req.body.commission + commission.commission
                    }
                }, (err, _commission) => {
                    if (err) { res.status(400).send(err) };
                    if (_commission) { res.status(200).send(_commission) }
                })
            
        } else {
            const _commission = new Commission({
                sellerId:req.user.id,
                        commission:req.body.commission
            })
            _commission.save().then((com) => {
                res.status(200).send(com);
            }).catch((err) => {
                res.status(400).send(err)
            })
        }
    })
}