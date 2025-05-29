import { Request, Response } from 'express';
import { identifyContact } from '../services/contactService';

export const handleIdentify = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'email or phoneNumber is required' });
  }

  try {
    const contact = await identifyContact(email, phoneNumber);
    res.json({ contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};