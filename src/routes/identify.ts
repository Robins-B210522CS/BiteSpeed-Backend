import express, { Request, Response, NextFunction } from 'express';
import { handleIdentify } from '../controllers/identifyController';

const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  handleIdentify(req, res).catch(next);
});

export default router;