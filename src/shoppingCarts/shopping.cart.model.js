import { Schema, model } from "mongoose";

const shoppingCartSchema = Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        },
        price:{
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('ShoppingCart', shoppingCartSchema);