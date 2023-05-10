// 1st we require our mongoose package
const mongoose = require('mongoose');
// Require dotenv to consume the config.env file
const dotenv = require('dotenv');
/* dotenv has a variable called config on it and then in there we just have
to pass an object to specify the path where our configuration file is located.
It will read our variables from the file and save them into node JS environment variables.*/
dotenv.config({ path: './config.env' });

// IMPORT APP
const app = require('./app');

// This env is set by Express
console.log(app.get('env'));

// We replace the placeholder <password> with the real password
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// 2nd we access to mongoose and call the connect method
/* into this connect method, we need to pass in:
1 - our database connection string. 
2 - An object with some options that we need to specify in order to deal with some deprecations warnings */
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful!');
  });

// SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  }, // schema type options for each field
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// MODEL
// NAME, SCHEMA - model name (tour) should be with an uppercase "T" as a convention
const Tour = mongoose.model('Tour', tourSchema);

// Here we create an instance of the tour model
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

// The mongoose model has a couple of methods on it that we can use in order to interact with de DB
// .save() will return a promise that we can then consume
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR 💥:', err);
  });

// DEFINE THE PORT
const port = process.env.PORT || 3000;

// START SERVER
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
