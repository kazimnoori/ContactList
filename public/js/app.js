
function getContacts() {
  return $.ajax('/api/contact')
    .then(res => {
      console.log("Results from getContacts()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getContacts()", err);
      throw err;
    });
}


function refreshContactList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getContacts()
    .then(contacts => {

      window.contactList = contacts;

      const data = {contacts: contacts};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}


function toggleAddContactForm() {
  console.log();
  setFormData({});
  toggleAddContactFormVisibility();
}

function toggleAddContactFormVisibility() {
  $('#form-container').toggleClass('hidden');
}

function submitContactForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const contactData = {
   first_name: $('#first_name').val(),
   last_name: $('#last_name').val(),
    company: $('#company').val(),
    email: $('#email').val(),
    phone: $('#phone').val(),
    _id: $('#contact-id').val(),

  };

  let method, url;
  if (contactData._id) {
    method = 'PUT';
    url = '/api/contact/' + contactData._id;
  } else {
    method = 'POST';
    url = '/api/contact';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(contactData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshContactList();
      toggleAddContactForm();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your contact data", contactData);
}

function cancelContactForm() {
  toggleAddContactFormVisibility();
}


function editContactClick(id) {
  const contact = window.contactList.find(contact => contact._id === id);
  if (contact) {
    setFormData(contact);
    toggleAddContactFormVisibility();
  }
}

function deleteContactClick(id) {
  if (confirm("Are you sure?")) {
    $.ajax({
      type: 'DELETE',
      url: '/api/contact/' + id,
      dataType: 'json',
      contentType : 'application/json',
    })
      .done(function(response) {
        console.log("Contact", id, "is DOOMED!!!!!!");
        refreshContactList();
      })
      .fail(function(error) {
        console.log("I'm not dead yet!", error);
      })
  }
}

function setFormData(data) {
  data = data || {};

  const contact = {
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    company: data.company || '',
    email: data.email || '',
    phone: data.phone || '',
    _id: data._id || '',
  };

  $('#first_name').val(contact.first_name);
  $('#last_name').val(contact.last_name);
  $('#company').val(contact.company);
  $('#email').val(contact.email);
  $('#phone').val(contact.phone);
  $('#contact-id').val(contact._id);
}
