import { Router } from "express";
import { check } from 'express-validator';
import { addShoppingCart, checkOut, removeProductFromCart, viewShoppingCart } from "./shopping.cart.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateStockProduct } from "../middlewares/validar-products.js";
import { handleShoppingCart, verifyCart, processReceipt, clearCart, validateProductInCart, updateProductStockAndSales } from "../middlewares/validar-shoppingCart.js";

const router = Router();

router.get(
    "/",
    [
        validarJWT
    ],
    viewShoppingCart
)

router.post(
    "/add",
    [
        validarJWT,
        check("quantity", "quantity is required").not().isEmpty(),
        check("quantity", "quantity must be a number").isNumeric(),
        check("quantity", "quantity must be greater than 0").isInt({ min: 0 }),
        validateStockProduct,
        handleShoppingCart,
        validarCampos
    ],
    addShoppingCart
)

router.post(
    "/checkOut",
    [
        validarJWT,
        verifyCart,
        processReceipt,
        clearCart
    ],
    checkOut
)

router.put(
    "/:id",
    [
        validarJWT,
        validateProductInCart,
        updateProductStockAndSales,
    ],
    removeProductFromCart
)


export default router;