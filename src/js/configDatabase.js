import mongoose, { connection } from 'mongoose';
import { mongoDatabaseUrl } from './config';
import { setDatabaseReady } from './utils/UtilityFunctions';

const retryInterval = 60000;

function connectDatabase() {
  mongoose.connect(mongoDatabaseUrl, { useNewUrlParser: true }).catch(err => {
    console.error(`Failed to connect to database. Retrying in ${retryInterval / 1000} seconds.`);
    console.error(err);

    setDatabaseReady(false);
    setTimeout(connectDatabase, retryInterval);
  });
}

connection.once('open', () => {
  console.log('Connected to database.');
  setDatabaseReady();
});

export default connectDatabase;
