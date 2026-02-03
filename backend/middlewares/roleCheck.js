
const roleCheck = (roles) => {
    return (req, res, next) => {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!req.user || !req.user.role) {
            return res.status(401).json({ 
                success: false, 
                message: "Yetkisiz erişim! Kullanıcı rolü saptanamadı." 
            });
        }
        const hasRole = allowedRoles.some(role => 
            role.toLowerCase() === req.user.role.toLowerCase()
        );

        if (!hasRole) {
            return res.status(403).json({ 
                success: false, 
                message: `Bu işlem için '${allowedRoles.join(' veya ')}' yetkisi gereklidir.` 
            });
        }

        next();
    };
};

export default roleCheck;