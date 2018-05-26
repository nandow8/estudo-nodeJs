'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async(data) => {
    //mostra TUDO
    //var res = await Order.find({})
    //.populate('customer') //traz tambem os dados do customer (JOIN T-T)
    //.populate('items.product'); //é preciso dominar o array (seguir direitinho onde se encontra o produto)
    
    //mostra só o que eu quiser
    var res = await Order.find({}, 'number status customer items')
        .populate('customer', 'name') 
        .populate('items.product', 'title');
    return res;
}

exports.create = async(data) => {
    var order = new Order(data);
    await order.save();
}