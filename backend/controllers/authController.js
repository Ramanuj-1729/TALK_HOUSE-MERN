const hashService = require("../services/hashService");
const otpService = require("../services/otpService");
const tokenService = require("../services/tokenService");
const userService = require("../services/userService");
const UserDto = require('../dtos/user-dto');

class AuthController {
    async sendOtp(req, res) {
        // Request Phone Number
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ message: 'Phone field is required!' });
        }

        // Generate OTP
        const otp = await otpService.generateOtp();

        // Generate Hash
        const timeToLeave = 1000 * 60 * 5; // 5 min
        const expires = Date.now() + timeToLeave;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // Send OTP
        try {
            // await otpService.sendBySms(phone, otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "OTP sending failed" })
        }

    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;

        if (!otp || !hash || !phone) {
            res.status(400).json({ message: "All field required!" });
        }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400).json({ message: "Otp expired" });
        }

        // OTP Vrification
        const data = `${phone}.${otp}.${expires}`;
        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            res.status(400).json({ message: "Invalid OTP" });
        }

        // Creae User
        let user;

        try {
            user = await userService.findUser({ phone });
            if (!user) {
                user = await userService.createUser({ phone });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Db error" });
        }

        // Token
        const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false });

        await tokenService.storeRefreshToken(refreshToken, user._id);
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });

    }

    async refresh(req, res) {
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        try {
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
            if (!token) {
                return res.status(401).json({ message: "Invalid Token!" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal Error!" });
        }

        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const { refreshToken, accessToken } = tokenService.generateTokens({ _id: userData._id });

        try {
            await tokenService.updateRefreshToken(refreshToken, userData._id);
        } catch (error) {
            return res.status(500).json({ message: "Internal Error!" });
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;
        await tokenService.removeToken(refreshToken);

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ user: null, auth: false });
    }
}

module.exports = new AuthController();