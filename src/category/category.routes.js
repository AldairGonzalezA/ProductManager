import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, getCategory, searchCategory, updateCategory, deleteCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCategory } from "../helpers/db-validator.js";
import { tieneRol } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getCategory)

router.get(
    "/searchCategory/:id",
    [
        check("id", "ID is invalid").isMongoId(),
        check("id").custom(existeCategory),
        validarCampos
    ],
    searchCategory
)

router.post(
    "/",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        validarCampos
    ],
    saveCategory
),

router.put(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "ID is invalid").isMongoId(),
        check("id").custom(existeCategory),
        validarCampos
    ],
    updateCategory
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "ID is invalid").isMongoId(),
        check("id").custom(existeCategory)
    ],
    deleteCategory
)

export default router;