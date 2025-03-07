import { verify, hash } from "argon2";
import User from '../users/user.model.js';

export const validateUserDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const authenticatedUser = req.usuario;

        if (authenticatedUser._id.toString() !== id && authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: 'Only the user can delete their profile or an administrator'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                msg: 'As a security measure, enter the user`s password to delete it'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'The password entered is incorrect'
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error during user validation',
            error: error.message
        })
    }
}

export const validatePasswordUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password, oldPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        const validPassword = await verify(user.password, oldPassword);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'The old password is incorrect'
            });
        }

        if (password) {
            req.body.password = await hash(password, 10); // Hashea la nueva contraseña
        }
    
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to update the password',
            error: error.message
        })
    }
}