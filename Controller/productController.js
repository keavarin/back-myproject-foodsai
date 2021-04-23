const {Product, sequelize} = require('../models');
const {QueryTypes}= require('sequelize')
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');


exports.getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({products})
    }catch(err){
        next(err)
    }
};

exports.bulkCreate = async(req, res, next)=>{  
    
    try{
        const {products} = req.body;
       
        for ({name, price,status,imgUrl} of products){ 
            if(!name || !name.trim()) 
            return res.status(400).json({message: 'name is require'})
            if(!price) 
            return res.status(400).json({message: 'price is require'})
            if(!(+price > 0)) 
            return res.status(400).json({message: 'price must numeric and greater than 0'})
        }
        await Product.bulkCreate(products)
        res.status(201).json({message: 'all product created'})
    }catch(err){
        next(err)
    }
}

exports.createProduct = async (req, res,next)=>{
    try{
        const {name, price, status, imgUrl} = req.body;
        if(!name || !name.trim()) 
            return res.status(400).json({message: 'name is require'})
            if(!price) 
            return res.status(400).json({message: 'price is require'})
            if(!(+price > 0)) 
            return res.status(400).json({message: 'price must numeric and greater than 0'})
        const products = await Product.create({name, price, status, imgUrl})
        res.status(200).json({products})
    }catch(err){
        next(err)
    }
}

exports.updateProduct = async (req, res,next)=>{
    try{
        const {id} =req.params
        const {name, price, status, imgUrl} = req.body;
        if(!name || !name.trim()) 
            return res.status(400).json({message: 'name is require'})
            if(!price) 
            return res.status(400).json({message: 'price is require'})
            if(!(+price > 0)) 
            return res.status(400).json({message: 'price must numeric and greater than 0'})
        await Product.update({name, price,status, imgUrl}, {where: {id}})
       
        res.status(200).json({message: 'update success'})
    }catch(err){
        next(err)
    }
}
