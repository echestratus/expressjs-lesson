const createError = require("http-errors");
const { selectByEmail } = require("../models/users");
const bcrypt = require('bcrypt');
const { standardizeResponse } = require("../helpers/common");
const { generateToken, generateRefreshToken } = require("../helpers/auth");

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const {rows:[user]} = await selectByEmail(email);
        if (!user) {
            return next(createError(401, "incorrect email or password"));
        }
        const verifyPassword = bcrypt.compareSync(password, user.password);
        if (!verifyPassword) {
            return next(createError(401, "incorrect email or password"));
        }
        
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            user_id: user.user_id
        }

        const token = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const data = {
            email: user.email,
            role: user.role,
            token: token,
            refreshToken: refreshToken
        }

        standardizeResponse(res, "success", 200, "Login succeed", data);
    } catch (err) {
        console.log(err);
        next(createError.InternalServerError());
    }
}

module.exports = {
    login
}