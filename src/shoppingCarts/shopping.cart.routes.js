import { Router } from "express";
import { check } from 'express-validator';
import { addShoppingCart, finalllyShop } from "./shopping.cart.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/add",
    [
        validarJWT,
        check("quantity", "quantity is required").not().isEmpty(),
        check("quantity", "quantity must be a number").isNumeric(),
        check("quantity", "quantity must be greater than 0").isInt({ gt: 0 }),
        validarCampos
    ],
    addShoppingCart
)

router.post(
    "/finally",
    [
        validarJWT,
        validarCampos
    ]
)

export default router;