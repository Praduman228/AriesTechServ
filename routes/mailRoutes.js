const express=require('express')
const router=express.Router();
const nodemailer = require('nodemailer');

router.get('/', function(req, res) {
    res.render('index');
});
router.post("/sendmail", async (req, res) => {
    const { name, email, companyname, requirement } = req.body;
     console.log(name,email,companyname, requirement)
    if (!name || !email || !companyname || !requirement) {
        return res.status(400).json({ message: "Server Error" });
    }

    try {
        // Nodemailer Transporter Configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        
        const userMailOptions = {
            from: `"Aries TechServ" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank You for Contacting Aries TechServ!",
            html: `
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to <strong>Aries TechServ</strong>. We have received your inquiry and will get back to you as soon as possible.</p>
                <p><strong>Details you provided:</strong></p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Company:</strong> ${companyname}</li>
                    <li><strong>Requirement:</strong> ${requirement}</li>
                </ul>
                <p>We appreciate your interest and look forward to assisting you.</p>
                <br>
                <p>Best Regards,</p>
                <p><strong>Aries TechServ</strong></p>
            `,
        };

        // **Mail to Self (Admin Notification)**
        const adminMailOptions = {
            from: `"Aries TechServ" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Your email for notifications
            subject: "New Contact Form Submission - Aries TechServ",
            html: `
                <p><strong>New Inquiry Received:</strong></p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Company:</strong> ${companyname}</li>
                    <li><strong>Requirement:</strong> ${requirement}</li>
                </ul>
                <p>Please follow up as soon as possible.</p>
                <br>
                <p>Aries TechServ</p>
            `,
        };

        // Send both emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        return res.redirect("/")
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending emails." });
    }
});

module.exports = router