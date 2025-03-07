import Receipt from '../receipts/receipt.model.js';
import Product from '../products/products.model.js';

export const validateProductInReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productName } = req.body;
        const { quantityToRemove} = req.body;
        const product = await Product.findOne({name: productName}); 
        console.log(product);
        if (quantityToRemove <= 0) {
            return res.status(400).json({
                success: false,
                msg: 'Quantity to remove must be greater than 0',
            });
        }

        const receipt = await Receipt.findById(id);

        if (!receipt) {
            return res.status(404).json({
                success: false,
                msg: 'Shopping cart not found',
            });
        }

        const productInReceipt = receipt.products.find(item => {
            console.log('Comparing productId in receipt:', item.productId._id.toString());
            console.log('With product _id:', product._id.toString());
            return item.productId._id.toString() === product._id.toString();
        });
        
        if (!productInReceipt) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found in the receipt',
            });
        }

        if (quantityToRemove > productInReceipt.quantity) {
            return res.status(400).json({
                success: false,
                msg: 'Quantity to remove exceeds the quantity in the receipt',
            });
        }

        req.receipt = receipt;
        req.productInReceipt = productInReceipt;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating receipt',
            error: error.message
        })
    }
}

export const updateProductStockAndSales = async (req, res, next) => {
    try {
        const { quantityToRemove } = req.body;
        const { productName } = req.body;

        const product = await Product.findOne({name: productName});

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found',
            });
        }

        const newStock = product.stock + quantityToRemove;
        const newSales = product.sales - quantityToRemove

        await Product.findByIdAndUpdate(product._Id, {
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