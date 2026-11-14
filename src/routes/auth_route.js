import express from 'express';
import {
    register,
    login,
    findUserById,
} from '../controllers/auth_controller.js';
import validate from '../middlewares/validate.js';
import validateRegisterSchema from '../schemas/signup_schema.js';
import authenticate from '../middlewares/authenticate.js';
import isOwner from '../middlewares/isOwner.js';

const router = express.Router();

router.post('/register', authenticate, isOwner, validate(validateRegisterSchema), register);
router.post('/login', login);
router.get('/profile', authenticate, findUserById);


export default router;