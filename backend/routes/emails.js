const { Router } = require("express");
const { createEmail, deleteEmail, getEmails } = require("../controllers/emails");

router = Router();


router.post('/add-email', createEmail)

router.delete('/delete-email', deleteEmail)

router.get('/get-emails', getEmails)


module.exports = router;