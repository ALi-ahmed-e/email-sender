const { Router } = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");

const router = Router();

// Multer setup for file uploads
const upload = multer({
    dest: "/tmp", // Temporary directory
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post("/send-req", upload.single("excelFile"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        if (!req.body.email) return res.status(400).json({ error: "No email template provided" });
        if (!req.body.subject) return res.status(400).json({ error: "No subject provided" });

        const preparedMailTemplate = req.body.email;
        const filePath = req.file.path;
        const subject = req.body.subject;

        // Read the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Extract user details
        const processedData = data.map(row => ({
            name: row.name || "User",
            email: row.email,
            certificateLink: row.certificate || "",
            workshop: row.workshop || "No workshop available"
        }));

        // Delete the uploaded file after processing
        await fs.unlink(filePath);

        // Send emails
        const { Tmails } = await sendEmails(processedData, preparedMailTemplate, subject);

        res.status(200).json({
            message: "Emails processed!",
            Tmails
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Server error processing file" });
    }
});

// Function to send emails with optimized handling
const sendEmails = async (users, emailTemplate, subject) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.APP_EMAIL_ADDRESS,
            pass: process.env.APP_EMAIL_PASS
        },
        tls: { rejectUnauthorized: false },
        pool: true, // Enable connection pooling
        maxConnections: 5, // Allows up to 5 emails at once
        maxMessages: 100 // Limits each connection to 100 emails
    });

    let Tmails = [];
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Static email footer/signature
    const staticPart = `
        <hr>
        <p><strong>IEEE El Shorouk Academy Student Branch</strong></p>
        <p>Nonprofit Organization | Cairo, Egypt 11837</p>
        <p>Contact: <a href="mailto:ieee.sha.sb@gmail.com">ieee.sha.sb@gmail.com</a></p>
        <p>
            Follow us: 
            <a href="https://www.facebook.com/IEEE.ElShoroukAcademy.SB/">Facebook</a> |
            <a href="https://www.linkedin.com/company/10977911/">LinkedIn</a> |
            <a href="https://www.instagram.com/ieee.sha.sb/">Instagram</a>
        </p>
    `;

    for (const user of users) {
        let retries = 3; // Retry sending email up to 3 times
        while (retries > 0) {
            try {
                let personalizedEmail = emailTemplate.replace("{name}", user.name);
                personalizedEmail = personalizedEmail.replace("{workshop}", user.workshop);
                personalizedEmail = personalizedEmail.replace(
                    "{certificate}",
                    user.certificateLink ? `<a href="${user.certificateLink}" target="_blank">View Certificate</a>` : "No certificate available."
                );
                personalizedEmail += staticPart; // Add footer

                const mailOptions = {
                    from: process.env.APP_EMAIL_ADDRESS,
                    to: user.email,
                    subject: subject,
                    html: personalizedEmail
                };

                await transporter.sendMail(mailOptions);
                Tmails.push({ email: user.email, state: true });
                console.log(`✅ Email sent to: ${user.email}`);
                break; // Exit retry loop if successful
            } catch (error) {
                console.error(`❌ Failed to send email to ${user.email}:`, error);
                retries--; // Reduce retry count
                if (retries === 0) {
                    Tmails.push({ email: user.email, state: false });
                }
                await sleep(1000); // Wait 1 sec before retrying
            }
        }

        await sleep(1000); // Wait 1 sec between emails to avoid spam detection
    }

    return { Tmails };
};

module.exports = router;
