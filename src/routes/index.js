//**src/routes/index.js**//
const router = require('express').Router();
const mongoose = require('mongoose');

const CONTACTS = [
  {id: '1', first_name: 'Kazim', last_name: 'Noori', company: 'LMG', email: 'noorikazim@gmail.com', phone: '2708058451'},
  {id: '2', first_name: 'Charles', last_name: 'Helms', company: 'LF', email: 'charlesm@gmail.com', phone: '1234567890'},
  {id: '3', first_name:'Ben', last_name: 'Moore', company:'ED', email: 'ben@gmail.com', phone: '0987654321'},
  {id: '4', first_name: 'Tommy', last_name: 'Clark', company: 'Louisville Forward', email: 'tommy@yahoo.com', phone:'502-323-3322'}
];


router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

router.get('/contact', function(req, res, next) {
  mongoose.model('Contact').find({deleted: {$ne: true}}, function(err, contacts) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(contacts);
  });
});


router.post('/contact', function(req, res, next) {
  const Contact = mongoose.model('Contact');
  const contactData = {
   first_name: req.body.first_name,
    last_name: req.body.last_name,
    company: req.body.company,
    email: req.body.email,
    phone: req.body.phone,
  };

  Contact.create(contactData, function(err, newContact) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newContact);
  });
});

router.put('/contact/:contactId', function(req, res, next) {
  const Contact = mongoose.model('Contact');
  const contactId = req.params.contactId;

  Contact.findById(contactId, function(err, contact) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!contact) {
      return res.status(404).json({message: "Contact not found"});
    }

    contact.first_name = req.body.first_name;
    contact.last_name = req.body.last_name;
    contact.company = req.body.company;
    contact.email = req.body.email;
    contact.phone = req.body.phone;

    contact.save(function(err, savedContact) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedContact);
    })

  })
});

router.delete('/contact/:contactId', function(req, res, next) {
  const Contact = mongoose.model('Contact');
  const contactId = req.params.contactId;

  Contact.findById(contactId, function(err, contact) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!contact) {
      return res.status(404).json({message: "Contact not found"});
    }

    contact.deleted = true;

    contact.save(function(err, doomedContact) {
      res.json(doomedContact);
    })

  })
});

router.get('/contact/:contactId', function(req, res, next) {
  const {contactId} = req.params;


  const contact = CONTACTS.find(entry => entry.id === contactId);
  if (!contact) {
    return res.status(404).end(`Could not find contact '${contactId}'`);
  }

  res.json(contact);
});

module.exports = router;
