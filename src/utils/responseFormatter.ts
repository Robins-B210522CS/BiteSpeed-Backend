type Contact = {
  id: number;
  email?: string;
  phoneNumber?: string;
};

export const formatContactResponse = (primary: Contact, secondaries: Contact[]) => {
  const emails = new Set([primary.email, ...secondaries.map(s => s.email)].filter(Boolean));
  const phoneNumbers = new Set([primary.phoneNumber, ...secondaries.map(s => s.phoneNumber)].filter(Boolean));
  const secondaryIds = secondaries.map(s => s.id);

  return {
    primaryContatctId: primary.id,
    emails: [...emails],
    phoneNumbers: [...phoneNumbers],
    secondaryContactIds: secondaryIds
  };
};
