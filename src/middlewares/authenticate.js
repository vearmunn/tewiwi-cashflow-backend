import supabase from '../config/supabase.js';

const authenticate = async (req, res, next) => {
    try {

        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                status: 'failed',
                message: 'Authentication required',
            });
        }

        const [scheme, token] = authorization.split(' ');

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid authorization format',
            });
        }
        const { data, error } =
            await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        req.user = data.user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: 'failed',
            message: 'Invalid or expired access token',
        });
    }
}

export default authenticate;