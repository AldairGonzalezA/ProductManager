import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
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
            required: true,
            autopopulate: { select: 'name brand ._id'}
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

receiptSchema.plugin(mongooseAutoPopulate)

export default model('Receipt', receiptSchema);