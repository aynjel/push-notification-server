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
        
        const publicKey = 'BCol311jRW4M59BwcFAMiESdjaTHaNGQTJ-kC88feFnLEJ6nC-2JFOBcMX-rLRIO8NaaXYwDRCLn1a_s4XgR384';
        const privateKey = 'CjLPPZaLJNhv6dynvL_BMURqHwWRpjfI-K2G0PZkXB0';

        const sub = {
            endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABlQ33HwyGckJgFadvDbKdT_ridScZnUJ-0J8gdzu3cWT9-JZyGVdw1wyTnLLS1BhxfMPkiXWSh9ziwMxY7AgWrEuEPl5BRjDKy4s2cg2IaVgyjP5PXuzz5ZaPhCPkW02WDroTCun5mFmZk9PIRRQ6JFlYi-4eIY2tsEiUHbCAJwAQ7Te4',
            expirationTime: null,
            keys: {
                p256dh: 'BBfElKxsq0AQbwSGQvjo8-9JH7qD1Hgy7ompty4IUp35RamJPt-yFL7tuMncMcaEso3PE8Fwq8g0L3t1of07Xe0',
                auth: 'd6MTOjqx4r1s-HN5b3PWkw',
            },
        };

        const payLoad = {
            notification: {
                data: { url: 'http://www.youtube.com/funofheuristic' },
                title: 'Test Notification from Server',
                vibrate: [100, 50, 100]
            },
        };

        webPush.setVapidDetails('mailto:sample@mail.com', publicKey, privateKey);

        webPush.sendNotification(sub, JSON.stringify(payLoad))
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });

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