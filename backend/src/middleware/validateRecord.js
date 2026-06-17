const emailPattern = /^\S+@\S+\.\S+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

export const validateRecordInput = (req, res, next) => {
  const errors = [];
  const { name, email, phone, address } = req.body;

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !emailPattern.test(email)) {
    errors.push('A valid email is required');
  }

  if (!phone || !phonePattern.test(phone)) {
    errors.push('A valid phone number is required');
  }

  if (!address || address.trim().length < 5) {
    errors.push('Address must be at least 5 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};
