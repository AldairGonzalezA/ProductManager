import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Can´t be overcome 25 cheracters']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        maxLength: [25, 'Can"t be overcome 25 characters '],
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        maxLength: [25, "Can;t be overcome 25 characters"]
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: [true, 'Phone number is required']
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE','CLIENT_ROLE']
    },
    receipts:[{
        type: Schema.Types.ObjectId,
        ref: 'Receipt'
    }],
    estado: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.toJson = function(){
    const {__v, password, _id, ...usuario
        
    } = this.toObjects();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);