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

    // Define the static part to be added to all emails
    const staticPart = `
        <table>
    <tbody>
        <tr>
            <!-- Left part (Logo) -->
            <td style="padding-right: 15px;">
                <p dir="ltr">
                    <img class="CToWUd a6T" tabindex="0" 
                         src="https://lh4.googleusercontent.com/-Esrvsr7gZa9Y8E-6yrov9kY4XIDKrQWljMUDrJQt_MtpxVpz9XORLHAEx1ICkNj3z-lnwf2ECCih96pJIKdd62SoyiYp6hCyFMWSEXq4IUd50Vb8sMwE9pGtIgQGTlXqK7GPzx8" 
                         alt="13669560_1651548535173119_7146689281211647779_n.png" 
                         width="202" height="201" crossorigin="" data-bit="iit">
                </p>
            </td>

            <!-- Vertical Line -->
            <td style="border-left: 2px solid #000; padding: 0 15px;"></td>

            <!-- Right part (Text & Contact Info) -->
            <td style="padding-left: 15px;">
                <p dir="ltr"><strong>IEEE El Shorouk Academy Student Branch</strong></p>
                <p dir="ltr">Nonprofit Organization</p>
                <br>
                <p><strong>Chairman: Kareem Raafat</strong></p>
                <p><strong>Vice-Chairman: Suhaila Essam</strong></p>
                <p><strong>Treasurer: Abdallah Darwesh</strong></p>
                <p>HR Department:<br><a href="mailto:ieee.sha.sb@gmail.com">ieee.sha.hr@gmail.com</a></p>
                <p>Branch Mail:<br><a href="mailto:ieee.sha.sb@gmail.com">ieee.sha.09@gmail.com</a></p>
                <p>El-Shorouk City, Palms District</p>
                <p>Cairo, Egypt 11837</p>

                <br>

                <!-- Social Media Icons -->
                <p dir="ltr">
                    <a href="https://www.facebook.com/IEEE.ElShoroukAcademy.SB/?fref=ts" target="_blank" rel="noopener">
                        <img class="CToWUd" src="https://lh6.googleusercontent.com/v6Z30Wl9ThHW1dYqTe0FCPOVhI0GiBmu6gER9PVpdwO-auJvwjseyMe55QTqWlZ1kiN1a9pp6M1UsoCfvSJq9Y2t6eB3M0Oax-fKGRlNMEFFsiwqFRZ3M-jeojpM8mcBh9TGxMyi" 
                             alt="facebook.png" width="38" height="38">
                    </a>
                    <a href="https://www.linkedin.com/company/10977911/" target="_blank" rel="noopener">
                        <img class="CToWUd" src="https://lh3.googleusercontent.com/Ic6yKDDjLV5-1c3J7tQw972e-tqPiKujCAc-NC6pLp1Nxs6T_GveBBRXi5YeuA9yvqY4AiLNOZjqW99A3VKn5icFZoNXr4ZndR0kbWgb8Z3Nbm-7_4lFRGJGR81JD8WcELAInZoO" 
                             alt="linkedin.png" width="38" height="38">
                    </a>
                    <a href="https://www.instagram.com/ieee.sha.sb/" target="_blank" rel="noopener">
                        <img class="CToWUd" src="https://lh5.googleusercontent.com/UAv0ESo3nkasL3O-_rJ5k1eSSSODtDzGliL9VW9JaVzcteQg2i2WEC7OM1xKum7-1PIHIgty2EZXD01k8j0jxWEJfjemguPS-MqZDcTOHkpmEoJtRLGVPLdZSrCsi6j0sGjNOCNa" 
                             alt="instagram.png" width="38" height="38">
                    </a>
                </p>
            </td>
        </tr>
    </tbody>
</table>

    `;

    for (const user of users) {
        try {
            // Replace placeholders in the template
            let personalizedEmail = emailTemplate.replace("{name}", user.name);

            // If there's a certificate link, replace the {certificate } placeholder
            if (user.certificateLink) {
                personalizedEmail = personalizedEmail.replace(
                    "{certificate}",
                    `<a href="${user.certificateLink}" target="_blank">View Certificate</a>`
                );
            } else {
                personalizedEmail = personalizedEmail.replace("{certificate}", "No certificate available.");
            }

            // Append the static part
            personalizedEmail += staticPart;

            const mailOptions = {
                from: process.env.APP_EMAIL_ADDRESS,
                to: user.email,
                subject: "Your Certificate",
                html: personalizedEmail
            };

            await transporter.sendMail(mailOptions);
            Tmails.push({ email: user.email, state: true });
            console.log(`✅ Email sent to: ${user.email}`);
        } catch (error) {
            console.error(`❌ Failed to send email to ${user.email}:`, error);
            Tmails.push({ email: user.email, state: false });
        }
    }

    return { Tmails };
};

module.exports = router;
