
import supabase from '../config/supabase.js';
import * as authRepo from '../repositories/auth_repository.js';

async function register(req, res) {
    try {
        const { email, password, name, role } = req.body;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({
                status: 'failed',
                message: error.message,
            });
        }

        const user = await authRepo.create({ id: data.session.user.id, email, name, role })

        if (!user) {
            return res.status(400).json({
                status: 'failed',
                message: error.message,
            });
        }

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresAt: data.session.expires_at,
                user: data.user,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid email or password',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresAt: data.session.expires_at,
                user: data.user,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
    }
}

export { register, login };
