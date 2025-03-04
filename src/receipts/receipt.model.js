import { Schema, model } from "mongoose";

const receiptSchema = Schema({
    date: {
        type: Date,
        default: Date.now
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[{
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
    total: {
        type: Number,
        default: 0.00
    }
},
    {
        timestamp: true,
        versionKey: false
    }
);

export default model('Receipt', receiptSchema);