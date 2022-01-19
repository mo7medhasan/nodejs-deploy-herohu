const Cart = require("../models/cart.module.js");


//ADD ITEM TO CART 
exports.addToCart = (req, res) => {
    console.log("!!!!!!!",req.body.items)
    Cart.findOne({ userId: req.user.id }, (err, cart) => {
        if (err) { res.status(400).send(err) }
        if (cart) {
            const item = cart.items.find(elem => elem.productId == req.body.items.productId)
            if (item) {
                Cart.findOneAndUpdate({ "userId": req.user.id, "items.productId": req.body.items.productId }, {
                    "$set": {
                        "items.$": {
                            ...req.body.items,
                            quantity: item.quantity + req.body.items.quantity
                        },
                        totalCount:req.body.totalCount,
                        totalPrice:req.body.totalPrice
                    }
                }, (err, _cart) => {
                    if (err) { res.status(400).send(err) };
                    if (_cart) { res.status(200).send(_cart) }
                })
            } else {
                Cart.findOneAndUpdate({ userId: req.user.id }, {
                    "$push": {
                        "items": [req.body.items]
                    }
                }, (err, _cart) => {
                    if (err) { res.status(400).send(err) };
                    if (_cart) { res.status(200).send(_cart) }
                })
            }
        } else {
            const cart = new Cart({
                items: req.body.items,
                userId: req.user.id,
                totalCount:req.body.totalCount,
                totalPrice:req.body.totalPrice
            })
            cart.save().then((cart) => {
                res.status(200).send(cart);
            }).catch((err) => {
                res.status(400).send(err)
            })
        }
    })
}


//Change QUANTITY OF PRODUCT IN CART
//check stock..
exports.changeQuantity = (req, res) => {
    Cart.findOneAndUpdate({ "_id": req.params.cartId }, {
        $set: { "items.$[element].quantity": req.body.quantity }
    },
        {
            arrayFilters: [{ "element.productId": req.params.productId }],
            new: true
        }, (err, cart) => {
            if (err) res.status(403).send(err);
            res.send(cart);
        })
}


//GET CART ITEMS FOR USER
exports.getCartItems = (req, res) => {
    Cart.findOne({ userId: req.user.id }, { items: 1, _id: 0 }, function (err, cart) {
        if (err) res.status(400).send(err);
        res.status(200).send(cart);
    });
    // Cart.findOne({ userId: req.user.id }, { items: 1, _id: 0 })
    // .populate('items.productId')
    // .exec(function (err, cart) {
    //     if (err) res.send(err);
    //     res.status(200).send(cart)
    // })
};


//REMOVE ITEM FORM CART
exports.deleteItemFromCart = (req, res) => {
    Cart.findOne({ userId: req.user.id }, (err, cart) => {
        if (err) { res.status(400).send(err) }
        if (cart) {
            const item = cart.items.find(elem => elem.productId == req.params.productId)
            if (item) {
                Cart.findOneAndUpdate({ "userId": req.user.id, "items.productId": req.params.productId }, {
                    "$pull":
                        { items: { productId: req.params.productId } }
                }, (err, _cart) => {
                    if (_cart) { res.status(200).send(_cart) }
                    if (err) { res.status(400).send(err) };
                })
            } else {
                res.status(401).send("you don't have this product")
            }
        } else {
            res.status(402).send("you don't have Cart")
        }
    })
}


//DELETE CARTS
exports.removeCart = (req, res) => {
    Cart.findByIdAndDelete(req.params.cartId, (err, cart) => {
        if(err){res.status(400).send(err)}
        if(cart){res.status(200).send([cart,"cart is deleted successfully..."])}
    })
}


//GET CART BY USER ID
exports.getCart = (req, res) => {
    Cart.findOne({userId:req.params.userId}, (err, cart) => {
        if(err){res.status(400).send(err)}
        if(cart){res.status(200).send(cart)}
    })
}









// exports.increaseQuantity = (req,res) => {
    // Cart.findOne({"userId":req.user.id},(err,cart)=>{
    //     const item = cart.items.find(elem => elem.productId == req.params.productId)
    //     const index = cart.items.indexOf(item);
    //     console.log(cart.items[index].quantity)
    //     ++cart.items[index].quantity;  
    //     console.log(cart.items)
    //     const items = cart.items;
    //     // res.send(item)
    //     if(item){
    //         Cart.findOneAndUpdate({"userId":req.user.id,"items.productId": req.params.productId},{
    //             "$set":{
    //                 "items.$":{
    //                     ...items
    //                 }
    //             }
    //         },(err,_cart)=>{
    //             if(err){res.status(400).send({message:err})};
    //             if(_cart){res.status(200).send(_cart)}
    //         })
    //     }
    // })
// }


////////////////////
