const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshTokenModel = require('../models/refreshTokenModel');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1h',
        });

        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y',
        });

        return { accessToken, refreshToken };
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshTokenModel.create({
                refreshToken: token,
                userId
            });
        } catch (error) {
            console.log(error);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }

    async verifyRefreshToken(token) {
        return jwt.verify(token, refreshTokenSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshTokenModel.findOne({ userId, refreshToken });
    }

    async updateRefreshToken(refreshToken, userId) {
        return await refreshTokenModel.updateOne({ userId }, { refreshToken });
    }

    async removeToken(refreshToken) {
        return await refreshTokenModel.deleteOne({ refreshToken });
    }
}

module.exports = new TokenService();