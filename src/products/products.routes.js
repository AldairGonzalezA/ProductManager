import { Router } from "express";
import { check} from 'express-validator';
import { saveProduct, getProducts, updateProduct, searchProduct, deleteProduct } from "./products.controller.js";
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeProduct } from "../helpers/db-validator.js";
import { tieneRol } from '../middlewares/validar-role.js';

const router = Router();

router.get("/", getProducts)

router.get(
    "/findProduct/:id",
    [

        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeProduct),
        validarCampos
    ],
    searchProduct
)

router.post(
    "/",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("name", "Name is required").not().isEmpty(),
        check("salePrice", "The price is required").isNumeric(),
        validarCampos
    ],
    saveProduct
)

router.put(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeProduct),
        check("name", "The name is required").not().isEmpty(),
        check("price", "The price is required").isNumeric(),
        validarCampos
    ],
    updateProduct
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeProduct),
        validarCampos
    ],
    deleteProduct
)

export default router;