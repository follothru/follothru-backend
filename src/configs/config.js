module.exports = {
  port: process.env.PORT || 3000,
  mongodbUrl: process.env.DB_URL || 'mongodb://mongo:27017/follothru',
  prod: process.env.PROD || false,
  mongodbCloudUrl:
    'mongodb://follothru:psychology2017@ds217921.mlab.com:17921/follothru'
};
