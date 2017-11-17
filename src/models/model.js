// Load mongoose//
const mongoose = require('mongoose');

//Database schema and variables//
const ContactSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  company: String,
  email: String,
  phone: String,
  created_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false}
});


const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;


Contact.count({}, function(err, count) {
  if (err) {
    throw err;
  }

  if (count > 0) return ;

  const contacts = require('./seed.json');
  Contact.create(contacts, function(err, newContacts) {
    if (err) {
      throw err;
    }
    console.log("DB seeded")
  });
});
