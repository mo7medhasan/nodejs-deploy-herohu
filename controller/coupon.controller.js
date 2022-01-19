const Coupon = require("../models/coupon.module.js");

exports.createNewCoupon = (req, res) => {

    try {
        Coupon.findOne({ name: req.body.name }, (err, couponAlreadyExist) => {
            if (err) {
                res.status(404).send({ message: "err", err });

            }
            if (couponAlreadyExist) {
                res.status(404).send({ message: "Coupon already exists" });
            } else {
                const NewCoupon = new Coupon({
                    name: req.body.name,
                    Rate: req.body.Rate / 100,
                    ExpiryDate: new Date(req.body.ExpiryDate),
                    adminId: req.user.id,
                    adminName: req.user.name
                });
                NewCoupon.save().then((coupon) => {
                    console.log(coupon);
                    res.status(200).send(coupon)
                }).catch((err) => {
                    res.status(401).send([{ message: "something wrong in create coupon" }, err])
                })
            }
        })
    } catch (error) {
        res.status(401).send([{ message: "something wrong" }, error])
    }

}

exports.getRateCoupon = (req, res) => {
    console.log(req.body);

    try {
        Coupon.findOne({ name: req.params.name }, (err, coupon) => {
            if (err) {
                res.status(401).send({ message: "something wrong in find coupon" }, err)
            }
            if (!coupon) {
                res.status(404).send({ message: "Sorry  didn't find this coupon" });
            } else if (coupon) {
                if (coupon.ExpiryDate >= Date.now()) {
                    Coupon.findOne({ name: req.params.name, userId: req.user.id }, (err, userIdIsUsedCoupon) => {
                        if (err) {
                            res.status(401).send([{ message: "something wrong in find coupon & User" }, err])
                        }
                        if (userIdIsUsedCoupon) {
                            res.status(404).send({ message: "You already Used this Coupon" });
                        } else {
                            Coupon.findOneAndUpdate({ name: req.params.name }, {
                                "$set": { countUsers: coupon.countUsers + 1 },
                                "$push": {
                                    userId: req.user.id
                                }

                            }).then((coupon_1) => {
                                // if (coupon_1.userId.length > 0) {
                                //     coupon_1.
                                //     coupon_1.save()
                                console.log(coupon_1);

                                res.status(200).send(coupon_1)
                            }).catch((err) => {
                                res.status(401).send({ message: "something wrong in get Rate coupon" }, err)
                            })
                        }
                    })

                } else {
                    res.status(404).send({ message: "Coupon  has already expired" });
                }
            }
        })
    } catch (error) {
        res.status(401).send({ message: "something wrong" }, error)
    }
}

exports.getAllCoupon = (req, res) => {
    try {
        Coupon.find({}).then(coupons => {
            res.status(200).send(coupons);
        }).catch(err => {
            res.status(400).send({ message: "something wrong in find all " }, err)
        })

    } catch (error) {
        res.status(401).send({ message: "something wrong" }, error)
    }

}



exports.getCouponByAdmin = (req, res) => {
    try {
        Coupon.findById(req.params.id).then(coupon => {
            res.status(200).send(coupon);
        }).catch(err => {
            res.status(400).send([{ message: "something wrong in find coupon " }, err])
        })

    } catch (error) {
        res.status(401).send({ message: "something wrong" }, error)
    }

}


exports.deleteCoupon = (req, res) => {
    try {
        Coupon.findByIdAndDelete(req.params.id).then(data => {

            res.status(200).send(data)
        }).catch(err => {
            res.status(400).send({ message: "something wrong in delete coupon" }, err);
        })
    } catch (error) {
        res.status(400).send({ message: "something wrong in delete coupon in catch" }, error);

    }

}


exports.EditCoupon = (req, res) => {
    try {
        Coupon.findByIdAndUpdate(req.params.id, {

            name: req.body.name,
            Rate: req.body.Rate / 100,
            ExpiryDate: new Date(req.body.ExpiryDate),
            adminId: req.user.id,
            adminName: req.user.name

        }, { new: true })
            .then(coupon => {
                res.status(200).send(coupon)
            }).catch((err) => {
                res.status(400).send({ message: "something wrong in Edit coupon", err })
            })
    } catch (error) {
        res.status(400).send({ message: "something wrong in Edit coupon in catch", error });

    }


}