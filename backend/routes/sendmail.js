const { Router } = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");

const router = Router();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/send-req", upload.single("excelFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        if (!req.body.email) {
            return res.status(400).json({ error: "No email template provided" });
        }

        const preparedMailTemplate = req.body.email; // Email HTML template
        const filePath = req.file.path; // Path to the uploaded Excel file

        // Read the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Assume first sheet
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Extract user details
        const processedData = data.map(row => ({
            name: row.name, // Ensure your Excel sheet has a 'name' column
            email: row.email, // Ensure your Excel sheet has an 'email' column
            certificateLink: row.certificate || "" // Handle empty certificate links
        }));

        // Delete the uploaded file after processing
        await fs.unlink(filePath);

        // Send emails and track results
        const { Tmails } = await sendEmails(processedData, preparedMailTemplate);

        res.status(200).json({ 
            message: "Emails processed!",
            Tmails
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Server error processing file" });
    }
});

// Function to send emails
const sendEmails = async (users, emailTemplate) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL_ADDRESS, // Sender's email
            pass: process.env.APP_EMAIL_PASS, // App password
        },
    });

    let Tmails = [];

    for (const user of users) {
        try {
            // Replace placeholders in the template
            let personalizedEmail = emailTemplate.replace("{name}", user.name);

            // If there's a certificate link, replace the {certificate } placeholder
            if (user.certificateLink) {
                personalizedEmail = personalizedEmail.replace("{certificate}", `<a href="${user.certificateLink}" target="_blank">View Certificate</a>`);
            } else {
                // If no certificate, remove the placeholder
                personalizedEmail = personalizedEmail.replace("{certificate}", "No certificate available.");
            }

            const mailOptions = {
                from: process.env.APP_EMAIL_ADDRESS,
                to: user.email,
                subject: "Your Certificate",
                html: personalizedEmail
            };

            await transporter.sendMail(mailOptions);
            Tmails.push({ email: user.email, state: true });
            console.log(user);
        } catch (error) {
            console.error(`❌ Failed to send email to ${user.email}:`, error);
            Tmails.push({ email: user.email, state: false });
        }
    }

    return { Tmails };
};

module.exports = router;
