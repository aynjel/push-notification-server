import { Router } from 'express';
import { PushNotificationController } from '../controllers/PushNotificationController';
import { BaseRoutes } from './BaseRoutes';

export class PushNotificationRoutes extends BaseRoutes {
    private pushNotificationController: PushNotificationController = new PushNotificationController();
    
    constructor() {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post('/subscribe', this.pushNotificationController.subscribe);
    }

    public get getRouter(): Router {
        return this.router;
    }
}