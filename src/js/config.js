require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;

export const port = process.env.PORT;

export const nodeEnv = process.env.NODE_ENV;

export const devMongoDatabaseUrl = 'mongodb://mongo:27017/follothru';

export const mongoDatabaseUrl = nodeEnv === 'prod' ?
  `mongodb+srv://follothru:${encodeURI(dbPassword)}@follothru-db-rsgd2.mongodb.net/test?retryWrites=true&w=majority`
  : devMongoDatabaseUrl;

export const secretKey = process.env.SECRET_KEY;
