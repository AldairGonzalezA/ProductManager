import { hash, verify } from 'argon2';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generater-jwt.js';

export const login = async (req,res) =>{
    const  {email, password, username} = req.body;

    try {

        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [
                {email: lowerEmail},
                {username: lowerUsername}
            ]
        });

        if (!user) {
            return res.status(400).json({
                msg :'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            })
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: `Welcome ${user.username} `,
            userDetails:{
                username: user.username,
                token: token,
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Server Error',
            error: e.message
        })
    }
}

export const register = async (req,res) => {
   try {
    const data = req.body;

    const encryptedPassword = await hash(data.password);

    const user = await User.create({
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: encryptedPassword,
        role: "CLIENT_ROLE"
    })

    return res.status(201).json({
        message: "User registered successfully",
        userDetails: {
            user: user.email
        }
    })

   } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'User registration failer',
            error: error.mesage
        });
   }
}

export const registerAdmin = async (req, res) => {
    try {
        const data = req.body;
    
        const encryptedPassword = await hash(data.password);
    
        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: "ADMIN_ROLE"
        })
    
        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })
    
       } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: 'User registration failer',
                error: error.mesage
            });
       }
}