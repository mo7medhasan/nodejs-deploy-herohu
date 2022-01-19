const paypalService = require('../services/paypal.service.js');
const paypal = require('paypal-rest-sdk');




exports.createPayment = (req, res) => {
    console.log(req.body)
    const products = JSON.parse(req.body.orderItems);
    // currency = req.body.currency;
    total = req.body.totalPrice;
    // subtotal = req.body.subtotal;
    shipping = req.body.shippingPrice;
    tax = req.body.taxPrice;
    //create payment object
    const payment = {
        "intent": "Sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": products.map((product) => {
                    return {
                        sku: product.prodId,
                        currency: "USD",
                        quantity: product.coountorder
                    }
                }),
            },
            "amount": {
                "currency": "USD",
                "total": total,
                "details": {
                "tax": tax,
                "shipping": shipping
            },},
            "description": "This is the payment description."
        }]
    }
    paypalService.createPaypalPayment(payment).then((transaction) => {
        console.log("Create Payment Response", payment)
        // console.log("Create Payment Response");
        // console.log("transaction: "+ JSON.stringify(transaction));
        // var transactionId = transaction.Id;
        // console.log("id : " + transactionId);
        // //NEED TO LOG ALL TRANSACTION FOR EACH REQUEST AND RESPONSE
        // //GENERATE TRANSACTION REFERENCE NUMBER
        // //TRANSCTION STATUS (SUCCESS, CANCELLED, FAILED, PENDING)
        // res.redirect("/success")
        for (let i = 0; i < transaction.links.length; i++) {
            if (transaction.links[i].rel === 'approval_url') {
                // res.redirect(transaction.links[i].href)
                res.json({ forwardLink: transaction.links[i].href });
                // res.send(transaction.links[i].href)
            }
        }
    }).catch((err) => {
        console.log(JSON.stringify(error));
        // res.redirect("/cancel");
        // throw error;
    })
}



exports.success = (req, res) => {
    console.log(req.query.PayerID)
    console.log(req.query.paymentId)
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId
    const executed_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "10.00"
            }
        }]
    }
    paypal.payment.execute(paymentId, executed_payment_json, function (err, payment) {
        if (err) {
            console.log(err.response);
        } else {
            console.log(JSON.stringify(payment))
            res.send(payment)
        }
    })

}



exports.cancel = (req, res) => {
    res.send('cancelled')
}
