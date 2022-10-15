const {secret} = require('../config').JWT;
const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){

    let authorization = req.headers['authorization'];

    if(authorization){
        jwt.verify(authorization, secret, function (err, decoded) {
            if (err) {
                res.status(401).json({
                    'Unauthorized': 'Invalid token'
                });
            } else {
                const {role, tenant} = decoded;
                if(tenant){
                    req.tenant = tenant;
                    req.role = role;
                    next();
                }
                else{
                    if(role === "super_admin"){
                        req.role = role;
                        next();
                    }
                    else{
                        res.status(401).json({
                            'Unauthorized': 'tenant not exist'
                        });
                    }
                }
            }
        });
    }
    else{
        res.status(403).json({
            'Unauthorized': 'restricted access'
        });
    }

}