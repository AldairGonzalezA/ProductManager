import ShoppingCart from '../shoppingCarts/shopping.cart.model.js';
import Receipt from '../receipts/receipt.model.js';
import User from '../users/user.model.js';
import Product from '../products/products.model.js';

export const handleShoppingCart = async ( req, res, next) => {
    try {
        const { quantity } = req.body;
        const user = req.usuario;
        const product = req.product;
        let cart = await ShoppingCart.findOne({owner: user._id});

        if(!cart){
            cart = await ShoppingCart.create({
                owner: user._id,
                products: [{
                    productId: req.product._id,
                    quantity: quantity,
                    price: req.product.salePrice,
                }],
            });
        }else {
            const existingProduct = cart.products.find(
                (item) => item.productId.toString() === product._id.toString()
            );
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({
                    productId: product._id,
                    quantity: quantity,
                    price: req.product.salePrice,
                })
            }

        }

        cart.totalPrice = cart.products.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        req.cart = cart; 
        next();
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg:'Error validating Shopping Cart',
            error: error.message
        })
    }
}

export const verifyCart = async (req, res, next) => {
    try {
        const user = req.usuario;
        const cart = await ShoppingCart.findOne({owner: user._id});

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'Shopping cart is empty',
            });
        }

        req.cart = cart;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating Shopping Cart',
            error: error.message
        })
    }
}

export const processReceipt = async (req, res, next) => {
    try {
        const user = req.usuario;
        const cart = req.cart;

        const receipt = await Receipt.create({
            customer: user._id,
            products: cart.products,
            total: cart.totalPrice,
        });

        await User.findByIdAndUpdate(user._id, {
            $push: { receipts: receipt._id },
        });

        req.receipt = receipt;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error processing receipt',
            error: error.message
        })
    }
}

export const clearCart = async (req, res, next) => {
    try {
        const cart = req.cart;

        await ShoppingCart.findByIdAndUpdate(cart._id, {
            $set: { products: [], totalPrice: 0.00 },
        });
        
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to clean the shopping Cart',
            error: error.message
        })
    }
}

export const validateProductInCart = async (req, res, next) => {
    try {
        const user = req.usuario;
        const { id } = req.params;
        const product = await Product.findById(id);
        const { quantityToRemove} = req.body;

        if (quantityToRemove <= 0) {
            return res.status(400).json({
                success: false,
                msg: 'Quantity to remove must be greater than 0',
            });
        }

        const cart = await ShoppingCart.findOne({ owner: user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                msg: 'Shopping cart not found',
            });
        }

        const productInCart = cart.products.find(item => item.productId._id.toString() === product._id.toString());

        if (!productInCart) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found in the shopping cart',
            });
        }

        if (quantityToRemove > productInCart.quantity) {
            return res.status(400).json({
                success: false,
                msg: 'Quantity to remove exceeds the quantity in the cart',
            });
        }

        req.cart = cart;  
        req.productInCart = productInCart;  
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating Shopping cart',
            error: error.message
        })
    }
}

export const updateProductStockAndSales = async (req, res, next) => {
    try {
        const { quantityToRemove } = req.body;
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found',
            });
        }

        const newStock = product.stock + quantityToRemove;
        const newSales = product.sales - quantityToRemove

        await Product.findByIdAndUpdate(product._id, {
            stock: newStock,
            sales: newSales,
        });

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to update product',
            error: error.message
        })
    }
}
