import { Request, Response, NextFunction } from 'express';
import PushNotification from '../models/PushNotification';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class PushNotificationController {
  
  // Subscribe to push notification
  public async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, body, data } = req.body;
      const pushNotification = new PushNotification({
        title,
        body,
        data
      });
      const newPushNotification = await pushNotification.save();
      res.status(201).json(newPushNotification);
    } catch (err) {
      next(err);
    }
  }

  // Send push notification
  public async send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, body, data } = req.body;
      const pushNotification = new PushNotification({
        title,
        body,
        data
      });
      const newPushNotification = await pushNotification.save();
      res.status(201).json(newPushNotification);
    } catch (err) {
      next(err);
    }
  }
}
