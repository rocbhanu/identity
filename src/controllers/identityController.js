const Contact = require('../models/contact');

const findOrCreateContact = async (email, phoneNumber) => {
  let allContacts = await Contact.findByPhoneOrEmail(phoneNumber, email);
  console.log(allContacts);
  console.log(email, phoneNumber);
  if (allContacts.length>0) {
    let contact = allContacts[0];
    const primaryContact = contact.link_precedence === 'secondary'
      ? await Contact.findById(contact.linked_id)
      : contact;
    for(let i=0;i<allContacts.length;i++){
      let emailId = allContacts[i].email
      let phoneNo = allContacts[i].phone_number
      console.log(emailId, phoneNo)
    if ((email==null || (email === emailId)) && (phoneNumber==null || (phoneNumber === phoneNo))) {
       return allContacts[i];
    }
    }
  
    const newSecondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact.id,
      linkPrecedence: 'secondary',
    });
    return newSecondaryContact;
  } else {
    const newPrimaryContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    });
    return newPrimaryContact;
  }
};

const getConsolidatedContact = async (primaryContactId) => {
  const allContacts = await Contact.findByLinkedIdOrId(primaryContactId, primaryContactId);
  const primaryContact = allContacts.find(c => c.link_precedence === 'primary');
  const secondaryContacts = allContacts.filter(c => c.link_precedence === 'secondary');
  
  const emails = new Set([
    primaryContact?.email,
    ...(secondaryContacts || []).map(c => c?.email)
  ].filter(Boolean))
  
  const phoneNumbers = new Set([
    primaryContact?.phone_number,
    ...(secondaryContacts || []).map(c => c?.phone_number)
  ].filter(Boolean));

  const secondaryContactIds = (secondaryContacts || []).map(c => c?.id).filter(Boolean);
  return {
    primaryContactId: primaryContact.id,
    emails: [...emails].filter(Boolean),
    phoneNumbers: [...phoneNumbers].filter(Boolean),
    secondaryContactIds,
  };
};

const identify = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const contact = await findOrCreateContact(email, phoneNumber);
    const primaryContactId = contact.linked_id == null ? contact.id:contact.linked_id;
    const consolidatedContact = await getConsolidatedContact(primaryContactId);
    res.json({ contact: consolidatedContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  identify,
};