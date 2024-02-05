const bcrypt = require("bcrypt");

/**
 * ************ ADAPTER PATTERN *************
 */
class Encryption {
  constructor() {}

  // Hashing password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  // Compare passwords
  static async comparePasswords(password, userPassword) {
    const res = await bcrypt.compare(password, userPassword);
    return res;
  }
}
// Export class
module.exports = Encryption;
