const crypto = require('crypto');
const hashService = require('./hashService');
const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSid, smsAuthToken, {
    lazyLoading: true
});

class OtpService {
    // Generate OTP Function
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    // Send SMS to phone
    async sendBySms(phone, otp){
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your Talk House otp is ${otp}`
        });
    }

    // Verify OTP
    verifyOtp(hashedOtp, data){
        let computedHash = hashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}

module.exports = new OtpService();