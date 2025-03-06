import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


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
            required: true,
            autopopulate: {select: 'name brand '}
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

shoppingCartSchema.plugin(mongooseAutoPopulate);

export default model('ShoppingCart', shoppingCartSchema);