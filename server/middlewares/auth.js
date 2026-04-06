const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {

    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if(!req.user){
                return res.status(400).json({message : "No authorization is given over here"});
            }

            next(); // move to next middleware

        } catch (err) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "No token, authorization denied" });
    }
};

const admin = (req, res, next)=>{
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        return res.status(400).json({message : "Forbidden only Admin could access this "});
    }
}




module.exports = {protect, admin};
