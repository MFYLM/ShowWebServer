const config = require("./config");
const jwt = require("jsonwebtoken");

let checkToken = (req, res, next) => {
    const token = req.headers["use-access-token"];
    if (!token)
    {
        res.send("Auth token is not supplied!");
    }
    else
    {
        jwt.verify(token, config.secret, (err, encoded) => {
            if (err)
                res.json({
                    success: false,
                    message: "Token is not valid!",
                    err: err
                });
            else
            {
                req.encoded = encoded;
                next();
            }
        });
    }
};



module.exports = {
    checkToken: checkToken
};
