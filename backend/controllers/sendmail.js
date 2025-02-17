const nodemailer = require('nodemailer');




const upload = multer({ dest: "uploads/" });

const uploadFile = async (req, res) => 

app.post("/send-req", upload.single("excelFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!req.body.email) {
      return res.status(400).json({ error: "No email provided" });
    }

    const preparedMail = req.body.email; // Email from FormData
    const filePath = req.file.path; // Path to the uploaded Excel file

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assume first sheet
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Process data and add preparedMail to each row
    const processedData = data.map(row => ({
      ...row,
      preparedMail
    }));

    // Delete the file after processing
    await fs.unlink(filePath);

    console.log("Processed Data:", processedData);

    res.status(200).json({ message: "File processed successfully!", data: processedData });

  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Server error processing file" });
  }
});

const sendMail = async (req, res) => {



  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASS,
    },
  });

  try {
    const { users, subject, message } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Users array must be a non-empty array.' });
    }

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required.' });
    }

    const batchSize = 5; // Adjust based on Gmail's limits
    let successfulEmails = [];
    let failedEmails = [];

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      for (const recipient of batch) {
        const mailOptions = {
          from: process.env.APP_EMAIL_ADDRESS,
          to: recipient,
          subject: subject,
          html: message, // Use text: message for plain text emails
        };

        try {
          await transporter.sendMail(mailOptions);
          successfulEmails.push(recipient);
        } catch (error) {
          console.error(`Failed to send email to ${recipient}:`, error);
          failedEmails.push(recipient);
        }
      }

      console.log(`Batch ${i / batchSize + 1} of ${Math.ceil(users.length / batchSize)} processed.`);

      // **Rate limiting to prevent spam detection**
      await new Promise(resolve => setTimeout(resolve, 1000)); // 5-second delay between batches
    }

    res.status(200).json({
      message: 'Emails processed!',
      successful: successfulEmails,
      failed: failedEmails
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails due to a server issue.' });
  }
}



// const uploadFile = async (req, res) => {

// const file = req.file
// const {email} = req.body

//   try {

//     console.log(file)
//     console.log(email)
//     res.status(200).json({
//       message: 'Emails processed!',
//       // successful: successfulEmails,
//       // failed: failedEmails
//     });

//   } catch (error) {
//     console.error('Error sending emails:', error);
//     res.status(500).json({ error: 'Failed to send emails due to a server issue.' });
//   }
// }



module.exports = {
  sendMail,
  uploadFile
}