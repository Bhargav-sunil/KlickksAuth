const validateGmail = (email) => {
  if (!email) return { isValid: false, message: "Email is required" };

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  // Gmail domain validation
  const domain = email.split("@")[1].toLowerCase();
  const allowedDomains = ["gmail.com", "googlemail.com"];

  if (!allowedDomains.includes(domain)) {
    return {
      isValid: false,
      message: "Only Gmail addresses are allowed",
    };
  }

  return { isValid: true, message: "Valid Gmail address" };
};

module.exports = { validateGmail };
