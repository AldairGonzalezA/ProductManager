import { Schema, model } from "mongoose";

const categorySchema = Schema ({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description:{
        type: String,
        required: [true, 'The category need a description']
    },
    status:{
        type: Boolean,
        default: true
    }
});

export default model('Category', categorySchema);