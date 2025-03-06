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
        const data = req.body
        const password  = data.password;
        const  oldPassword  = data.oldPassword;
        const user = await User.findById(id);
        const validPassword = await verify(user.password, oldPassword);
        if(!validPassword){
            return res.status(400).json({
                msg:'La contraseña antigua es incorrecta'
            })
        }
        if(password){
            data.password = await hash(password);
        }
        const updateUser = await User.findByIdAndUpdate(id, {password:data.password}, {new: true});

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
        const {id} = req.params;
        const password = req.body;
        const autheticatedUser = req.usuario;

        if(autheticatedUser._id.toString() === id || autheticatedUser.role === "ADMIN_ROLE"){
            const user = await User.findByIdAndUpdate(id, {estado: false}, {new: true});

            const validPassword = await verify(user.password, password);
            if(!validPassword){
                return res.status(404).json({
                    success: false,
                    msg: 'As a security measure, enter the user`s password to delete it'
                })
            }

            if(!user){
                return res.status(400).json({
                    success: false,
                    msg: 'User not found'
                })
            }

            return res.status(200).json({
                succes: true,
                msg: 'Usuario desactivado',
                user,
                autheticatedUser
            })
        }
        
        return res.status(404).json({
            success: false,
            msg: 'Only the user can delete their profile or an administrator'
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
}
 