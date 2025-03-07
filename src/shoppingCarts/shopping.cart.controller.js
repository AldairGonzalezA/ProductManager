import Product from '../products/products.model.js';
import ShoppingCart from './shopping.cart.model.js';

export const addShoppingCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = req.product;
        const cart = req.cart;

        const newStock = product.stock - quantity;
        const newSales = product.sales + quantity;
        await Product.findByIdAndUpdate(
            product._id,
            { stock: newStock, sales: newSales },
            { new: true }
        );

        await cart.save();

        res.status(200).json({
            success: true,
            msg: 'Product added to the shopping cart successfully!',
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating Shopping Cart',
            error: error.message
        })
    }
}

export const checkOut = async (req, res) => {
    try {
        const receipt = req.receipt;

        res.status(200).json({
            success: true,
            msg: 'Receipt created successfully',
            receipt,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to checkout',
            error: error.message
        })
    }
}

export const viewShoppingCart = async (req, res) => {
    try {
        const user = req.usuario;
        const cart = await ShoppingCart.findOne({owner: user._id})

        if(!cart || cart.products.length === 0){
            return res.status(404).json({
                success: false,
                msg: 'The shopping cart is empty'
            })
        }

        return res.status(200).json({
            success: true,
            msg: `Shopping Cart of ${user.username}`,
            cart
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to show the shopping Cart',
            errors: error.message
        })
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const product = await Product.findById(id);
        const { quantityToRemove } = req.body;

        const cart = req.cart;
        const productInCart = req.productInCart;
        
        if (!productInCart) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found in the shopping cart',
            });
        }

        productInCart.quantity -= quantityToRemove;

        if(productInCart.quantity === 0){
            const productIndex = cart.products.findIndex(item => item.productId._id.toString() === product._id.toString());
            
            if(productIndex !== -1){
                cart.products.splice(productIndex, 1);
            }
        }

        cart.totalPrice = cart.products.length > 0
        ? cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : 0;

        await cart.save();

        res.status(200).json({
            success: true,
            msg: 'Shopping Cart updated successfully',
            cart,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to update the shopping Cart',
            error: error.message
            
        })
    }
}