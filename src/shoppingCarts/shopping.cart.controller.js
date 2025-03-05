import { response, request} from 'express';
import User from '../users/user.model.js';
import Product from '../products/products.model.js';
import ShoppingCart from './shopping.cart.model.js';
import Receipt from '../receipts/receipt.model.js';

export const addShoppingCart = async (req, res) => {
    try {
        const user = req.usuario;
        const data = req.body;
        const product = await Product.findOne({name: data.product})
        let cart = await ShoppingCart.findOne({owner: user._id});

        if(!product){
            return res.status(400).json({
                success: false,
                msg: 'Product not found in the inventary'
            })
        }

        if(product.stock <= 0){
            return res.status(400).json({
                success: false,
                msg: 'Product out of stock'
            })
        }

        if(!cart){
            cart = await ShoppingCart.create({
                owner: user._id,
                products:[{
                    productId: product._id,
                    quantity: data.quantity,
                    price: product.salePrice
                }]
            })
        } else {
            const existingProduct = cart.products.find(item => item.productId.toString() === product._id);

            if(existingProduct){
                existingProduct.quantity += data.quantity;
            } else {
                cart.products.push({
                    productId: product._id,
                    quantity: data.quantity,
                    price: product.salePrice
                })
            }
        }
        const newSales = product.sales;
        const newStock = product.stock;
        Product.findByIdAndUpdate(product._id, {sales: newSales + data.quantity}, {stock: newStock - data.quantity}, {new: true});

        cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json({
            success: true,
            msg: 'Product added in the shopping cart successfully!',
            cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to add the product in the shopping cart',
            error: error.message
        })
    }
}

export const finalllyShop = async (req, res) => {
    try {
        const user = req.usuario;
        const cart = await ShoppingCart.findOne({owner: user._id});

        if(!cart){
            return res.status(400).json({
                success: false,
                msg: 'Shopping cart is empty'
            })
        }

        const receipt = await Receipt.create({
            customer: user._id,
            products: cart.products,
            total: cart.totalPrice
        })

        await User.findByIdAndUpdate(user_id, {
            $push: {receipts: receipt._id}
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to finalize the shopping',
            error: error.message
        })
    }
}