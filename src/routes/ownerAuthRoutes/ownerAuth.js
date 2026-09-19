const express = require('express');
const router = express.Router();

//all controllers imports
const {
  register,
  login,
  deleteAdmin,
  adminGetAll,
} = require('../../controllers/ownerAuthController/ownerAuth');

router.post('/register', register);
router.post('/login', login);
router.delete('/admin/delete/:id', deleteAdmin);
router.get('/admin/getAllAdmin', adminGetAll);

// export router
module.exports = router;
