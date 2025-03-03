import express, {application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import productRoutes from '../src/products/products.routes.js';

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use("/productManager/v1/auth", authRoutes);
    app.use("/productManager/v1/user", userRoutes);
    app.use("/productManager/v1/category", categoryRoutes);
    app.use("/productManager/v1/products", productRoutes);
}

const connectarDB = async () =>{
    try {
        await dbConnection();
        console.log('Conexion exitosa con la base de datos')
    } catch (error) {
        console.log('Error al conectar con la base de datos', error);
        process.exit(1);
    }
} 

export const initServer= async () =>{
    const app = express();
    const port = process.env.PORT || 3000;
    try {
        middlewares(app);
        connectarDB();
        routes(app);
        app.listen(port);   
        console.log(`Server running on port ${port}`);
    } catch (err) {
        console.log(`Server init failerd ${err}`);
    }
}