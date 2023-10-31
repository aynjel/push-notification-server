import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import webPush from "web-push";
import { PushNotificationRoutes } from "./routes/PushNotificationRoutes";

export class App {
    private pushNotification = new PushNotificationRoutes();

    constructor(
        private app: express.Application = express(),
    ) {


        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(cookieParser())

        // console.log(webPush.generateVAPIDKeys());
        
        const publicKey = 'BFg3iN6s_6BoiQ3zPCCoSdwZawOceM_YMLGxtpTe3lX6uTY6k9mk2IAd4y_Ccx3aaaXMszM6uiXY-Rg0agdoWkM';
        const privateKey = '3eZ0F860HYOr-JvAlBrBt1GSVpI9uGC0Rj7KHws6JZI';

        const sub = {
            endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABlQMqDdURd4wj6islS6lQlBmlK8MQ-4M5hPWQ7TjygJzZnGbry3T6bSNNLstx__tsa8pWpTVhJ2IjH49i9txLwtCciB-oWLBK8Ilnp34MG4PIomSFpwWO7mBOOxRZujRO4bae0my90sIJK2MHqLa2fOfVpng7m8uKtplb3uMIN6A0PqrU',
            expirationTime: null,
            keys: {
                p256dh: 'BIbbH0Fm1lFd4GFRRZBjclg19bAKt39G4Diz1URqGUm1jIQrosYgBlURd6wdc-blEA-pV3YdeRZJ26kG5t8jVWs',
                auth: '_5peZrbiY9VGs1VJp4XvZQ',
            },
        };

        const payLoad = {
            notification: {
                data: { url: 'http://www.youtube.com/funofheuristic' },
                title: 'Test Notification',
                vibrate: [100, 50, 100],
            },
        };

        webPush.setVapidDetails(
            'mailto:asdf@gmil.com',
            publicKey,
            privateKey
        );

        webPush.sendNotification(
            sub,
            JSON.stringify(payLoad)
        ).catch(err => console.error(err));

        this.app.post("/data", (req, res, next) => {
            console.log('request', req.body);
            const userData = req.body;
            console.log(JSON.stringify(userData));
            res.send(userData);
        });

        this.app.get("/", (req, res, next) => res.send("App Index page"));

        this.app.use("/api/push-notification", this.pushNotification.getRouter);
    }

    start() {
        this.app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
    }
}