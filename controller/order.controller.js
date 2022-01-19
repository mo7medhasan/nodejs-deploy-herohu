const Order = require("../models/order.module.js");
const Cart = require("../models/cart.module.js");
const User = require("../models/user.module.js");
const Product = require("../models/product.module.js");
const nodemailer = require('nodemailer');


const message = "Your order has been confirmed by amazon...."


// function calcIncomes(order) {
//     var pipeline = [
//         {
//             "$group": {
//                 "_id": "$orderItems.sellerId",
//                 "total": {
//                     "$sum": "$orderItems.quantity * $orderItems.price"
//                 }
//             }
//         }
//     ];
//     order.aggregate(pipeline)
//         .exec(function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//             console.log(result);
//             //   res.json(result);
//         });
// }



//create order
exports.createOrder = (req, res) => {
    console.log("create order: ", req.body)
    console.log("jjjj", req.user)
    Cart.findOne({ userId: req.user.id }, (err, cart) => {
        if (err) { res.status(400).send("Cart Is Not Found...") }
        if (cart) {
            console.log("$$$$")
            if (req.body.paymentmethod === 'PayPal') {
                var newOrder = new Order({
                    userId: req.user.id,
                    cartId: cart._id,
                    orderItems: cart.items,
                    shippingAddress: req.body.shippingAddress,
                    paymentmethod: req.body.paymentmethod,
                    shippingPrice: req.body.shippingPrice,
                    taxPrice: req.body.taxPrice,
                    totalPrice: req.body.totalPrice,
                    isPaid: true,
                })
            } else {
                console.log("$$$$2")
                var newOrder = new Order({
                    userId: req.user.id,
                    cartId: cart._id,
                    orderItems: cart.items,
                    shippingAddress: req.body.shippingAddress,
                    paymentmethod: req.body.paymentmethod,
                    shippingPrice: req.body.shippingPrice,
                    taxPrice: req.body.taxPrice,
                    totalPrice: req.body.totalPrice,
                    isPaid: false,
                })
            }
            newOrder.save().then(savedOrder => {
                // calcIncomes(savedOrder)
                Cart.findByIdAndDelete(cart._id, (err, cart) => {
                    if (err) { res.status(400).send(err) }
                    res.status(200).send([{ "Order": savedOrder, "cartAfterDeleted": cart }])
                    const output = `
                        <p>You have a new contact request</p>
                        <h3>Contact Details</h3>
                        <ul>  
                        <li>Name: ${req.user.name}</li>
                        <li>Email: ${req.user.email}</li>
                        <li>Phone: ${req.body.shippingAddress.phone}</li>
                        <li>========(Order Details)=========</li>
                        <li>paymentmethod: ${req.body.paymentmethod}</li>
                        <li>shippingPrice: ${req.body.shippingPrice}</li>
                        <li>taxPrice: ${req.body.taxPrice}</li>
                        <li>totalPrice: ${req.body.totalPrice}</li>
                        </ul>
                        <h3>Message</h3>
                        <p style="color :red;">${message}</p>
                                            `;
                    console.log(output)
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
                        to: req.user.email
                        , subject: "Order Confirmation"
                        , text: "your order has been confirmed"
                        , html: output
                    }
                    transporter
                        .sendMail(mailOptions)
                        .then((res) => {
                            console.log("Email sent successfully!!!", res);
                        }).catch((err) => {
                            console.log(err);
                        });

                })
            }).catch(err => res.status(404).send(err))
        }
    })
}



//CANCEL ORDER
exports.cancleOrder = (req, res) => {
    Order.findOne({ $or: [{ userId: req.user.id }, { _id: req.params.orderId }] }, (err, order) => {
        if (err) { res.status(400).send(err) };
        if (order) {
            if (order.isDelivered) {
                res.status(400).send({ message: "your order is paid or delivered so you cann't cancelled it ...." })
            } else {
                order.isCancelled = true;
            }
        }
        order.save().then(order => {
            res.status(200).send([{ message: "order cancelled successfully..." }, order])
        })
            .catch(err => {
                res.status(402).send(err)
            })
    })
}



//GET ALL ORDER
exports.getAllOrder = (req, res) => {
    Order.find({}).sort({ date: -1 })
        .populate('userId')
        .exec(function (err, order) {
            if (err) res.send(err);
            res.status(200).send(order)
        })
}



function decreaseCount(items) {
    items.map(i => {
        console.log(i.productId)
        Product.findOne({ _id: i.productId }, (err, prd) => {
            if (err) { res.send(err) }
            if (prd) {
                console.log("Before decrease....", prd)
                prd.countInStock -= i.quantity
                prd.save().then(prd => {
                    console.log("After decrease....", prd)
                }).catch(err => console.log(err))
            }
        })
        // const prd = Product.findOneById(i.productId)
        // console.log(prd.countInStock)
    })
}



//UPDATE ORDER BY ADMIN
exports.deliverOrderByAdmin = (req, res) => {
    Order.findOne({ _id: req.params.orderId }, (err, order) => {
        if (err) { res.status(400).send(err) };
        if (order) {
            if (order.isCancelled) {
                return res.status(400).send("this order is cancelled so you cann't change status ....")
            } else {
                if (order.isPaid) {
                    order.isDelivered = true
                    decreaseCount(order.orderItems)
                    console.log("before save", order)
                    order.save().then(order => {
                        console.log("after save", order)
                        res.status(200).send(order)
                    })
                        .catch(err => {
                            res.status(402).send(err)
                        })
                } else {
                    order.isPaid = true
                    console.log("before save", order)
                    order.save().then(order => {
                        console.log("after save", order)
                        res.status(200).send(order)
                    })
                        .catch(err => {
                            res.status(402).send(err)
                        })
                }
            }
        } else {
            return res.status(400).send({ message: "somthing wrong ..." })
        }

    })
}



//GET ORDER OF USER
exports.getUserOrders = (req, res) => {
    // let page;
    // if (!req.params.p || req.params.p < 1) {
    //     page = 1;
    // } else {
    //     page = parseInt(req.params.p)
    //     var skip = (parseInt(page) - 1) * 5
    // }
    console.log("....getUserOrders")

    // Order.find({ userId: req.user.id,  $or: [{isDelivered: false}, {isCancelled: false}] }).sort({ createdAt: -1 }).limit(10)//
    Order.find({ $and: [{ userId: req.user.id }, { $or: [{ isDelivered: false }, { isCancelled: false }] }] }).sort({ createdAt: -1 }).limit(10)//
        .populate('orderItems.productId')
        .exec(function (err, order) {
            console.log(order)
            if (err) res.send(err);
            res.status(200).send(order)
        })
}



//GET cancelled ORDER OF USErR
exports.getUserCancelledOrders = (req, res) => {
    // let page;
    // if (!req.params.p || req.params.p < 1) {
    //     page = 1;
    // } {
    //     page = parseInt(req.params.p)
    //     var skip = (parseInt(page) - 1) * 5
    // }
    console.log("getUserCancelledOrders start......")
    Order.find({ userId: req.user.id, isCancelled: true }).sort({ createdAt: -1 })
        .populate('orderItems.productId')
        .exec(function (err, order) {
            console.log(order)
            if (err) res.send(err);
            res.status(200).send(order)
        })
}



exports.getUserArchivedOrders = (req, res) => {
    // let page;
    // if (!req.params.p || req.params.p < 1) {
    //     page = 1;
    // } {
    //     page = parseInt(req.params.p)
    //     var skip = (parseInt(page) - 1) * 5
    // }
    console.log("getUserCancelledOrders start......")
    Order.find({ userId: req.user.id, isDelivered: true }).sort({ createdAt: -1 })
        .populate('orderItems.productId')
        .exec(function (err, order) {
            console.log(order)
            if (err) res.send(err);
            res.status(200).send(order)
        })
}



///////////
exports.getOrderById = (req, res) => {
    Order.findOne({ _id: req.params.id }).populate('orderItems.productId')
        .then(function (order) {
            console.log("in get order by id : ", order)
            res.send(order);
        })
        .catch(err => {
            res.status(402).send(err)
        })
}



//GET INFO OF ORDER USERS
exports.orderUserInfo = (req, res) => {
    Order.findOne({ _id: req.params.id })
        .populate('userId')
        .populate('orderItems.productId')
        .exec(function (err, order) {
            if (err) res.send(err);
            res.status(200).send(order)
        })

}



// TOP 10 CUSTOMERS
exports.getTop10Clients = async (req, res) => {
    let Top10Clients = await Order.aggregate([
        {
            $group: {
                _id: "$userId",
                totalTurnover: { $sum: "$totalPrice" }
            }
        },
        { $sort: { totalTurnover: -1 } },
        { $limit: 10 }
    ])
        .then(data => {
            res.status(200).send(data)
        })
}



//Charts
exports.forChart = async (req, res) => {
    const dailayOrders = await Order.aggregate([{
        $group: {
            _id: { $dateToString: { format: "%d-%m-%Y", date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' }
        }
    }, { $sort: { _id: 1 } }])
    try {
        res.status(200).send(dailayOrders)
    } catch (err) {
        res.status(404).send(err)
    }
}



exports.incomWeekly = async (req, res) => {
    const dailayOrders = await Order.aggregate([{
        $group: {
            _id: { $dateToString: { format: "%w", date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' }
        }
    }, { $sort: { _id: -1 } }])
    try {
        res.status(200).send(dailayOrders)
    } catch (err) {
        res.status(404).send(err)
    }
}



exports.getAllOrderpagination = async (req, res) => {
    let query;
    let total
    try {
        ////////////////////////////////////////////////////

        if (req.body.checkKey === "payMeth" && req.body.checValue != '') {

            query = Order.find({ paymentmethod: req.body.checValue });
            total = await Order.countDocuments({ paymentmethod: req.body.checValue });

        } else if (req.body.checkKey === "governate" && req.body.checValue != '') {

            query = Order.find({ "shippingAddress.governate": req.body.checValue });
            total = await Order.countDocuments({ "shippingAddress.governate": req.body.checValue });

        } else if (req.body.checkKey === "Status" && req.body.checValue != '') {
            if (req.body.checValue == 'Cancelled') {
                query = Order.find({ isCancelled: true });
                total = await Order.countDocuments({ isCancelled: true });
            }
            else if (req.body.checValue == 'Delivered') {
                query = Order.find({ isDelivered: true });
                total = await Order.countDocuments({ isDelivered: true });

            } else if (req.body.checValue === 'Paid') {
                query = Order.find({ isPaid: true });
                total = await Order.countDocuments({ isPaid: true });
            }
        } else {
            query = Order.find();
            total = await Order.countDocuments();
        }
        ///////////////////////////////////////////////////
        // let query = Order.find();

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        // const total = await Order.countDocuments();

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

