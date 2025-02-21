import "dotenv/config";

export const config = {
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DB_URL,
  },
};
