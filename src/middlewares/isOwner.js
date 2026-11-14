import * as authRepo from '../repositories/auth_repository.js';

const isOwner = async (req, res, next) => {
    try {
        const user = await authRepo.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        if (user.role !== "Owner") {
            return res.status(401).json({
                status: 'failed',
                message: 'Hanya owner yang bisa membuat akun baru',
            });
        }

        next()
    } catch (error) {
        return res.status(401).json({
            status: 'failed',
            message: 'Invalid or expired access token',
        });
    }
}
export default isOwner;