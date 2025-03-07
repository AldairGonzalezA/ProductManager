import Category from '../category/category.model.js';
import Product from '../products/products.model.js';

export const validateCategoryProduct = async (req, res, next) => {
    try {
        const { category } = req.body;

        if(!category){
            return next();
        }

        const newCategory = await Category.findOne({ 
            name: { $regex: `^${category.trim()}$`, $options: "i" }
        });

        if(newCategory){
            req.body.category = newCategory._id;
            return next();
        }else {
            return res.status(400).json({
                success: false,
                msg: 'Category not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to validing category'
        })
    }
}

export const validateStockProduct = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;
        const foundProduct = await Product.findOne({name: product});

        if(!foundProduct){
            return res.status(400).json({
                success: false,
                msg: 'Product not found in the inventory'
            });
        }

        if(foundProduct.stock < quantity){
            return res.status(400).json({
                success: false,
                msg: 'Product out of stock'
            });
        }

        req.product = foundProduct;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating product',
            error: error.message
        })
    }
}