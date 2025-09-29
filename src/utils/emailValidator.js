const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateEmailList = (emails) => {
  const valid = [];
  const invalid = [];

  emails.forEach(email => {
    if (isValidEmail(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  });

  return { valid, invalid };
};

module.exports = { isValidEmail, validateEmailList };