const jwt = require('jsonwebtoken');

 const authenticate = async (req,res,next) => {
    try {
        if(req.headers.authorization) {
jwt.verify(req.headers.authorization,process.env.JWT_SECRET,function(error,decoded){
    if(error) {
        res.status(500).json({
            message:"Unauthorized",
        });
    } else {
        req.body.userid = decoded.id;
        next()
    }
});
        } else {
            res.status(500).json({
                message:"No Token Present!!",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message:"No Token Present!!"
        });
    }
}

export default authenticate;