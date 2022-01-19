const WishList = require("../models/wishlist.module.js");


//CREATE WISHLIST
exports.createWishList = (req, res) => {
    WishList.findOne({
        userId: req.user.id,
        name: req.body.name
    },(err, wishlist) => {
        if (err) {
            res.status(400).send(err)
        }
        if (wishlist) {
            
            const item = wishlist.items.find(elem => elem.productId == req.body.items.productId)
            if (item) {
                res.status(401).send({
                    msg: "this item is added you can't adds it..."
                })
            } else {
                WishList.findOneAndUpdate({
                    userId: req.user.id,
                    name: req.body.name
                }, {
                    "$push": {
                        items: {
                            productId: req.body.items.productId
                        }
                    }
                }, (err, wishlist) => {
                    if (err) {
                        res.status(402).send([err, {
                            msg: "somthing wrong..2.."
                        }])
                    };
                    if (wishlist) {
                        res.status(201).send(wishlist)
                    }
                });
            }
        } else {
            console.log("i'm here....")
            var wishlist2;
            console.log(req.body)
            if(req.body.items.productId){
                wishlist2 = new WishList({
                    items: {
                        productId: req.body.items.productId
                    },
                    userId: req.user.id,
                    name: req.body.name                
                })
            }else{
                wishlist2 = new WishList({
                    userId: req.user.id,
                    name: req.body.name                
                })
            }
            wishlist2.save().then((wishlist2) => {
                res.status(200).send(wishlist2);
            }).catch((err) => {
                res.status(400).send({
                    msg: "something wrong..3..."
                })
            })
        }
    })
}


//GET USER'S Lists                
exports.getUserLists = (req, res) => {
    WishList.find({
        userId: req.user.id
    }, (err, wishlist) => {
        if (err) {
            res.status(400).send([err, {
                message: "you haven't lists here sorry ....."
            }])
        }
        if (wishlist) {
            res.status(201).json(wishlist)
        }
    })
}


//GET PRODUCTS OF WISHLIST
exports.getProductsInWishLists = (req, res) => {
    WishList.findOne({
        userId: req.user.id,
        _id: req.params.wishlistId
    }, {
        items: 1, _id:0
    }).then((data) => {
        res.status(201).json(data)
    }).catch((err) => {
        res.status(402).json([{
            msg: "somthing wrong try again...."
        }, err])
    })
}


//GET PRODUCT FROM WISHLIST CATEGORY
exports.getProductFromWishList = (req, res) => {
    WishList.findOne({
        userId: req.user.id,
        "items.productId": req.params.productId
    },(err, wishlist)=> {
        if(err){res.status(400).send(err)}
        if (wishlist) {
            const item = wishlist.items.find(elem => elem.productId == req.params.Id)
            if (item) {
                res.status(201).json(item)
            } else {
                res.status(402).json([{
                    message: "somthing wrong try again ...."
                }, err])
            }
        }else{
            res.send("there's no wishlist")
        }
    })
}


//DELET WISHLIST            
exports.deleteWishList = (req, res) => {
    WishList.findByIdAndDelete({
        userId: req.user.id,
        _id: req.params.wishlistId
    }).then((data) => {
        res.status(201).json([{
            msg: "done delete wishlist"
        }, data])
    }).catch((err) => {
        res.status(402).json([{
            msg: "wrong in delete wishlist"
        }, err])
    })
}


//UPDATE WISHLIST
exports.updateWishlist = (req,res)=>{
    WishList.findOneAndUpdate({
        userId: req.user.id,
        _id:req.params.wishlistId
    },{
        nameEn: req.body.nameEn,
        description:req.body.description,
        nameAr: req.body.nameAr,
        descriptionAr: req.body.descriptionAr
    },(err,wishlist)=>{
        if(err){ res.status(400).send(err)};
        if(wishlist){res.status(200).send(wishlist)}
    },{new:true})
}


// DELETE ONE PRODUCT FROM WISHLIST
exports.deleteProductFromWishList = (req, res) => {
    WishList.findOne({
        userId: req.user.id,
        "items.productId": req.params.productId
    },(err, wishlist)=> {
        if(err){ res.status(400).send(err)}
        if (wishlist) {
            wishlist.items  = wishlist.items.filter(prd=>prd.productId != req.params.productId)
            wishlist.save().then((wishlist) => {res.send(wishlist)}).catch((err) =>res.send(err))
        }else{
            res.status(400).send({msg:"sorry try again...."})
        }

    })

}