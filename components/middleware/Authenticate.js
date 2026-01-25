const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN;
const refreshSecretKey = process.env.REFRESH_TOKEN;

// Generate new token for users
exports.generateToken = async (user) => {
    try {
        const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

        return token;
        
    } catch (error) {
        console.error(`Error generating token: ${error.message}`);
    }
}; 

// Generate guest token
exports.generateGuestToken = async (guest) => {
    try {
        const payload = {
            id: guest._id,
            fullName: guest.fullName,
            phoneNumber: guest.phoneNumber,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

        return token;
        
    } catch (error) {
        console.error(`Error generating token: ${error.message}`);
    }
}; 

// verify token
exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = await req.headers["authorization"];
        if(!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }
        
        const token = authHeader.split(" ")[1];
        jwt.verify(token, secretKey, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                })
            }

            req.user = decoded;
            next();
        })
        
    } catch (error) {
        console.error(`Error generating token: ${error.message}`);
    }
};
