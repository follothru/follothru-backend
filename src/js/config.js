import urls from '../env';
require('dotenv').config();

const dbUsername = process.env.DB_USERNAME;

const dbPassword = process.env.DB_PASSWORD;

export const port = process.env.PORT;

export const env = process.env.NODE_ENV || 'dev';

export const devMongoDatabaseUrl = 'mongodb://mongo:27017/follothru';

export const mongoDatabaseUrl = urls[env].dbUrl
  .replace('<username>', encodeURI(dbUsername))
  .replace('<password>', encodeURI(dbPassword));

export const secretKey = process.env.SECRET_KEY;
