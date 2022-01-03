import nodemailer from'nodemailer';
import dotenv from'dotenv';

dotenv.config();

const emailSend = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport(
            {
                service: "Hotmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASSWORD
                },
            }
        );

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text:text,
        });
        console.log("Email sent Successfully");
    } catch (error) {
        console.log(error,"Email couldn't be sent.")
    }
};

export default emailSend;