import Receipt from './receipt.model.js';

export const getReceipts = async (req, res) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const userId = req.usuario._id;
        const query = {customer: userId};
                const [total, receipts] = await Promise.all([
                    Receipt.countDocuments(query),
                    Receipt.find(query)
                        .skip(Number(desde))
                        .limit(Number(limite))
                ])
         
                res.status(200).json({
                    sucess: true,
                    total,
                    receipts
                })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to get receipts',
            error: error.message
        })
    }
}

export const updateReceipt = async (req, res) => {
    try {
        const { quantityToRemove } = req.body;

        const receipt = req.receipt;

        const productInReceipt = req.productInReceipt;

        productInReceipt.quantity -= quantityToRemove;

        if(productInReceipt.quantity === 0){
            const productIndex = receipt.products.findIndex(item => item.productId.toString() === productId);
            receipt.products.splice(productIndex, 1);
        }

        receipt.total = receipt.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await receipt.save();

        res.status(200).json({
            success: true,
            msg: 'Receipt updated successfully',
            receipt,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to update the receipt',
            error: error.message
        })
    }
}



