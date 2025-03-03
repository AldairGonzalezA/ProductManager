import User from '../users/user.model.js';
import Category from '../category/category.model.js';

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

export const existeCategory = async (id = '') => {
    const existeCategory = await Category.findById(id);

    if(!existeCategory) {
        throw new Error(`La categoría con el id ${id} no existe en la base de datos`)
    }
}

export const existeProduct = async (id = '') => {
    const existeProduct = await Product.findById(id);

    if(!existeProduct) {
        throw new Error(`El producto con el id ${id} no existe en la base de datos`)
    }
}