import { response, request } from 'express';
import Product from '../products/products.model.js';
import Category from '../category/category.model.js';

export const saveProduct = async (req, res) => {
    console.log("hola")
    try {
        const data = req.body;
        const category = await Category.findOne({name: data.category});
        

        if(!category) {
            return res.status(400).json({
                success: false,
                msg: 'Category not found'
            })
        }

        const product = await Product.create({
            name: data.name,
            description: data.description,
            brand: data.brand,
            category: category._id,
            salePrice: data.salePrice,
            stock: data.stock

        })

        return res.status(200).json({
            success: true,
            msg: 'Product created successfully',
            productDetails:{
                product: product.name
            }
        })    
        

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error saving product',
            error: error.message 
        })
    }
}

export const getProducts = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0, sales, name, category,  stock, sort} = req.query;
        let query = {status: true};
        
        if(stock){
            query.stock = Number(stock);
        }

        if(sales){
            query.sales = Number(sales);
        }
        if(category){
            query.category = category;
        }

        let sortOptions = {};
        if(sort){
            if(sort === "A-Z") sortOptions.name = 1;
            else if(sort === "Z-A") sortOptions.name = -1;
            else if(sort === "salesAsc") sortOptions.sales = 1;
            else if(sort === "moreSell") sortOptions.sales = -1;
        }

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
               .skip(Number(desde))
               .limit(Number(limite))
               .sort(sortOptions)
        ]);

        res.status(200).json({
            success: true,
            msg: 'Products retrieved successfully',
            total,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting products',
            error: error.message
        })
    }
}

export const searchProduct = async (req, res = response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                msg: 'Product not found'
            })
        }
        res.status(200).json({
            success: true,
            msg: 'Product retrieved successfully',
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error searching products',
            error: error.message
        })
    }
}

export const searchProductName = async (req, res = response) => {
    try {
        const {product} = req.query;
        const productNameClean = product.replace(/\s+/g,'').toLowerCase();
        const product_ = await Product.find({
            name: { $regex: new RegExp(productNameClean, 'i')}
        })
        if(!product_.lenght === 0){
            return res.status(404).json({
                success: false,
                msg: 'Product not found'
            })
        }

        return res.status(200).json({
            success: true,
            product_
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to search the product',
            error: error.message
        })
    }
}

export const updateProduct = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, category, sales, status, ...data} = req.body;
        const newCategory = await Category.findOne({name: data.category});
        if(category){
            const categoryFound = await Category.findOne({name: category});
            if(!categoryFound){
                return res.status(400).json({
                    success: false,
                    msg: 'Category not found'
                });
            }
            data.category = categoryFound._id;
        }
        
        const product = await Product.findByIdAndUpdate(id, data, {new: true});

        return res.status(200).json({
            success: true,
            msg: 'Product updated successfully',
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating product',
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Product deleted successfully',
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting product',
            error: error.message
        })
    }
}