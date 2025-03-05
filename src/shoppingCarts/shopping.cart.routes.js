import { Router } from "express";
import { check } from 'express-validator';
import { addShoppingCart, checkOut } from "./shopping.cart.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/add",
    [
        validarJWT,
        check("quantity", "quantity is required").not().isEmpty(),
        check("quantity", "quantity must be a number").isNumeric(),
        check("quantity", "quantity must be greater than 0").isInt({ min: 0 }),
        validarCampos
    ],
    addShoppingCart
)

router.post(
    "/checkOut",
    [
        validarJWT,
        validarCampos
    ],
    checkOut
)

export default router;