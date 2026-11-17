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


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account. Only authenticated users with the owner role can access this endpoint.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: employee@tewiwi.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Employee
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: Supabase user information
 *       400:
 *         description: Registration failed or invalid request data
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       403:
 *         description: Forbidden - Only owners can register new users
 *       500:
 *         description: Internal server error
 */
router.post('/register', authenticate, isOwner, validate(validateRegisterSchema), register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user using their email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: owner@tewiwi.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Supabase access token
 *                     refreshToken:
 *                       type: string
 *                       description: Supabase refresh token
 *                     expiresAt:
 *                       type: integer
 *                       description: Token expiration timestamp
 *                       example: 1794916800
 *                     user:
 *                       type: object
 *                       description: Supabase authenticated user information
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile information of the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Authenticated user profile information
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                       example: owner@tewiwi.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       example: Owner
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authenticate, findUserById);



export default router;