import { Router } from "express";
import { check} from 'express-validator';
import { saveProduct, getProducts, updateProduct, searchProduct, deleteProduct, searchProductName } from "./products.controller.js";
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeProduct } from "../helpers/db-validator.js";
import { tieneRol } from '../middlewares/validar-role.js';
import { validateCategoryProduct } from "../middlewares/validar-products.js";

const router = Router();

router.get("/", getProducts)

router.get(
    "/findProduct/:id",
    [
        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeProduct)
    ],
    searchProduct
)

router.get(
    "/findProductName",
    [
        check("name", "Product name is required").notEmpty()
    ],
    searchProductName
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
        validateCategoryProduct
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
    ],
    deleteProduct
)

export default router;