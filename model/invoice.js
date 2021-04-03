const mongoose = require('mongoose');

const invoice = mongoose.Schema({
   sellerName: {
       type: String,
       require: true
   },
   customerName: {
       type: String,
       default: 'unknown'
   },
   products: [
       {
           title: {
               type: String,
               require: true
           },
           price: {
               type: Number,
               require: true
           },
           discount: {
               type: Number,
               default: 0
           }
       }
   ]
});

module.exports = mongoose.model('invoice', invoice);