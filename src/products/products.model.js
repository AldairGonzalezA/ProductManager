import { Schema, model } from 'mongoose';

const productSchema = Schema ({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Name can not exceed 25 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxLength: [100, 'Description can not exceed 100 characters']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        maxLength: [25, 'Brand can not exceed 25 characters']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    salePrice: {
        type: Number,
        required: [true, 'Sale Price is required'],
        min: 0.00
    },
    sales: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Product', productSchema);