import User from '../users/user.model.js';

export const existeUserById = async (id= '') => {
    const existUser = await User.findById(id);

    if (!existUser) {
        throw new Error(`El usuario con el id ${id} no existe en la base de datos`)
    }
}

export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la base de datos`);
    }
}