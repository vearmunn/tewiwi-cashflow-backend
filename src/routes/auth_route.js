import express from 'express';
import {
    register,
    login,
} from '../controllers/auth_controller.js';
import validate from '../middlewares/validate.js';
import validateRegisterSchema from '../schemas/signup_schema.js';

const router = express.Router();

router.post('/register', validate(validateRegisterSchema), register);
router.post('/login', login);


export default router;