import { Schema, model } from "mongoose";

const receiptSchema = Schema({
    date: {
        type: Date,
        default: Date.now
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
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