import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";
 
export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { estado: true};
 
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])
 
        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const user = await User.findById(id);
 
        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }
 
        res.status(200).json({
            success: true,
            user
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const {id} = req.params;
        const {_id, email, password, role, ...data} = req.body;
        const autheticatedUser = req.usuario;

        if(autheticatedUser.id.toString() === id || autheticatedUser.role === "ADMIN_ROLE"){
            const user = await User.findByIdAndUpdate(id, data, {new: true});

            return res.status(200).json({
                success: true,
                msg: 'User update !!',
                user
            })
        }

        return res.status(403).json({
            success: false,
            msg: 'Only the user can update their profile or an administrator'
        })
    } catch (error) {
        res.status(500).json({
            succccess: false,
            msg: 'Error to update user',
            error: error.message
        })
    }
}

export const updatePassword = async (req, res = response) =>{
    try {
        const { id } = req.params;
        const {password} = req.body;
       
        const updateUser = await User.findByIdAndUpdate(id, {password}, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Password update!!',
            updateUser
        })
    
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error to update the password',
            error: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'Deactivated user',
            id,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deactivating user',
            error: error.message
        });
    }
};
 