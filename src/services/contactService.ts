import { PrismaClient } from '@prisma/client';
import { formatContactResponse } from '../utils/responseFormatter';

const prisma = new PrismaClient();

type Contact = {
  id: number;
  email: string | undefined;
  phoneNumber: string | undefined;
  linkedId?: number | null;
  linkPrecedence: 'primary' | 'secondary';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export const identifyContact = async (email?: string, phoneNumber?: string) => {
  const contacts: Contact[] = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: { email, phoneNumber, linkPrecedence: 'primary' }
    });

    return {
      primaryContatctId: newContact.id,
      emails: [newContact.email],
      phoneNumbers: [newContact.phoneNumber],
      secondaryContactIds: []
    };
  }

  const primary = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];
  const secondaryContacts = contacts.filter(c => c.id !== primary.id);

  const exists = contacts.some(c => c.email === email && c.phoneNumber === phoneNumber);

  if (!exists && (email || phoneNumber)) {
    const newSecondary = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: 'secondary'
      }
    });

    secondaryContacts.push(newSecondary);
  }

  return formatContactResponse(primary, secondaryContacts);
};
