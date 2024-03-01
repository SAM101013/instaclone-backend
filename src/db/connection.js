const { Sequelize } = require("sequelize");

// Initialize Sequelize instance with your MySQL URI
const sequelize = new Sequelize(
  "bbygjl7iyiy2k1jg2gmm",
  "ujffxkx2n22f01uz",
  "cmgfOnYgoZ9WJjb75e3i",
  {
    host: "bbygjl7iyiy2k1jg2gmm-mysql.services.clever-cloud.com",
    dialect: "mysql",
  }
);

// Authenticate the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
