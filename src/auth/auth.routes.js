import { Router } from 'express';
import { login, register, registerAdmin } from './auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    login

);

router.post(
    '/register',
    registerValidator,
    register
);

router.post(
    '/registerAdmin',
    registerValidator,
    registerAdmin
);

export default router;