const express = require('express');
const app = express();
require("./DB");
const authRoute = require('./routes/auth.routes');
const userRoute = require('./routes/user.routes.js');
const productRoute = require('./routes/product.routes.js');
const categoryRoute = require('./routes/category.routes.js');
const cartRoute = require('./routes/cart.routes.js');
const orderRoute = require('./routes/order.routes.js');
const wishlistRoute = require('./routes/wishlist.routes.js');
const countryRoute = require('./routes/country.routes.js');
const governateRoute = require('./routes/governate.routes.js');
const cityRoute = require('./routes/city.routes.js');
const paypalRoute = require('./routes/paypal.routes.js');
const addressRoute = require('./routes/address.routes.js');
const couponRoute = require('./routes/coupon.routes.js')
const sellerRoute = require('./routes/seller.routes')
const fileRoutes = require('./routes/upload.routes');
const path = require('path');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/welcome.html'));
});
app.use('/api', fileRoutes.routes);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/country", countryRoute);
app.use("/api/governate", governateRoute);
app.use("/api/city", cityRoute);
app.use("/api/payment", paypalRoute);
app.use("/api/address", addressRoute);
app.use("/api/coupon",couponRoute);
app.use("/api/seller",sellerRoute);


//payment page
// app.get("/payment", function(req, res){
    //     //res.send("Servee Started .......");
    //     res.sendFile(__dirname + '/payment.html')
    // })
    // //sucess page
const paypalCtrl = require('./controller/paypal.controller.js');
app.get("/success",paypalCtrl.success)
// //cancelled page
// app.get("/err", function(req, res){
//     res.sendFile(__dirname + '/error.html')
// })


app.listen(process.env.PORT || 5000, () => {
    console.log(`server listen on ${process.env.PORT}`)
})