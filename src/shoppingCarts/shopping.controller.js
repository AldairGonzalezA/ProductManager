import { response, request} from 'express';
import User from '../users/user.model.js';
import Product from '../products/products.model.js';
import ShoppingCart from './shopping.cart.model.js';

export const updateShoppingCart = async (req, res) => {
    try {
        const user = req.usuario;
        const data = req.body;
        const product = await Producto.findOne({name: data.product})
        let cart = await ShoppingCart.findOne({owner: user._id});

        if(!product){
            return res.status(400).json({
                success: false,
                msg: 'Product not found in the inventary'
            })
        }

        if(!cart){
            cart = await ShoppingCart.create({
                owner: user._id,
                products:[{
                    productId: product._id,
                    quantity: data.quantity,
                    price: product.price
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
                    price: product.price
                })
            }
        }

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