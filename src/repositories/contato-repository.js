'use strict';

const mongoose = require('mongoose');
const Contato = mongoose.model('Contato');

exports.get = async() => {
    const res = await Contato.find({
        active: true
    }, 'name email message');
    return res;
}

exports.create = async(data) => {
    var contato = new Contato(data);
    await contato.save();
}