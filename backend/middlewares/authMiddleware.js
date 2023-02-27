const tokenService = require("../services/tokenService");

module.exports = async function(req, res, next) {
    try {
        const { accessToken } = req.cookies;
        if(!accessToken){
            throw new Error();
        }
        const userData = await tokenService.verifyAccessToken(accessToken);
        if(!userData){
            throw new Error();
        }
        req.user = userData;
        next();
    } catch (error) {
        res.status(401).jaon({message: "Invalid Token"});
    }
}