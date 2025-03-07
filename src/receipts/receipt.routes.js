import { Router } from "express";
import { getReceipts, updateReceipt } from "./receipt.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validateProductInReceipt, updateProductStockAndSales } from "../middlewares/validar-receipt.js";

const router = Router();

router.get(
    "/",
    [
        validarJWT
    ],
     getReceipts
)

router.put(
    "/:id",
    [
        validarJWT,
        validateProductInReceipt,
        updateProductStockAndSales
    ],
    updateReceipt
)

export default router;