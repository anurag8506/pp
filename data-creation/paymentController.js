const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage = async(req,res)=>{

    try {
        
        res.render('checkoutform');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async(req,res)=>{
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        description:req.body.description,
                        contact:"9369335762",
                        name: "Anurag Singh Yadav",
                        email: "anurag@scriptstudio.io"
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    renderProductPage,
    createOrder
}


















// const express = require('express');
// const Razorpay = require('razorpay');
// const app = express();

// let razorpay = new Razorpay({
//   key_id: 'YOUR_RAZORPAY_KEY_ID',
//   key_secret: 'YOUR_RAZORPAY_SECRET'
// });

// router.use(express.urlencoded({ extended: true })); 

// router.post('/create-order', (req, res) => {
//     let options = {
//         amount: req.body.totalCost * 100,  
//         currency: "INR",
//         receipt: "order_rcptid_11"
//     };

//     razorpay.orders.create(options, function(err, order) {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Error creating order");
//         } else {
//             res.redirect(`https://www.example.com/payment/${order.id}`);
//         }
//     });
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });





