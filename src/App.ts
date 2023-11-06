import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import webPush from "web-push";
import morgan from "morgan";
import path from "path";
import { PushNotificationRoutes } from "./routes/PushNotificationRoutes";

export class App {
    private pushNotification = new PushNotificationRoutes();

    constructor(
        private app: express.Application = express(),
    ) {

        // views for client
        this.app.use(express.static(path.join(__dirname, "views")));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: ["https://172.16.16.104:8080", "https://127.0.0.1:8080"],
        }));
        this.app.use(cookieParser())
        this.app.use(morgan("dev"));

        // console.log(webPush.generateVAPIDKeys());
        
        const publicKey = 'BCol311jRW4M59BwcFAMiESdjaTHaNGQTJ-kC88feFnLEJ6nC-2JFOBcMX-rLRIO8NaaXYwDRCLn1a_s4XgR384';
        const privateKey = 'CjLPPZaLJNhv6dynvL_BMURqHwWRpjfI-K2G0PZkXB0';

        this.app.get("/", (req, res, next) => {
            res.sendFile("index.html");
        });

        this.app.post("/send", (req, res, next) => {
            const payLoad = {
                notification: {
                    data: { url: req.body.url },
                    title: req.body.title,
                    vibrate: [100, 50, 100]
                },
            };
    
            webPush.setVapidDetails('mailto:sample@mail.com', publicKey, privateKey);
    
            webPush.sendNotification(req.body, JSON.stringify(payLoad))
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
            
            res.redirect("/");
        });

        // this.app.get("/", (req, res, next) => {
        //     const sub = {
        //         endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABlRLA-6qjCm2sltTF0ya5ZIeDVWGEt4r04tES0UCzxEgCRRW_kBIdosWknxhLftjjFs5DQLsHkcaZqi7TritWB2NjLN--nqrkCxGKpUGk3Fdurzzs8jJhEXW2s6UoDU1nk34xHPcV0ic44jg6DJ2xiMkg-yIuKqHtR7GkoESLHl6Qjgew',
        //         expirationTime: null,
        //         keys: {
        //             p256dh: 'BEZSRZbvIHBulrfRoS6Mvb6it-k4ELpxvrHHujTXVHHVMy2i20p_6zamzxd4pvoFZ-Wy7Ps3UFTlO4L3LNPWRwM',
        //             auth: '0c-elgA3RQhTekxlByXkyQ',
        //         },
        //     };
    
        //     const payLoad = {
        //         notification: {
        //             data: { url: 'http://www.youtube.com' },
        //             title: 'Test Notification from Server',
        //             vibrate: [100, 50, 100]
        //         },
        //     };
    
        //     webPush.setVapidDetails('mailto:sample@mail.com', publicKey, privateKey);
    
        //     webPush.sendNotification(sub, JSON.stringify(payLoad))
        //     .then((result) => {
        //         console.log(result);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        // });

        this.app.post("/subscribe", (req, res, next) => {
            const subscription = req.body;
            console.log(subscription);
    
            const payLoad = {
                notification: {
                    data: { url: 'http://www.youtube.com' },
                    title: 'Test Notification from Server',
                    vibrate: [100, 50, 100]
                },
            };
    
            webPush.setVapidDetails('mailto:sample@mail.com', publicKey, privateKey);
    
            webPush.sendNotification(subscription, JSON.stringify(payLoad))
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
            res.status(201).json("Subscription successful");
        });

        this.app.post("/data", (req, res, next) => {
            console.log('request', req.body);
            const userData = req.body;
            console.log(JSON.stringify(userData));
            res.send(userData);
        });


        this.app.use("/api/push-notification", this.pushNotification.getRouter);
    }

    start() {
        this.app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
    }
}