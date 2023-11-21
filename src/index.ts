import express from "express";
import cors from "cors";
import webPush from "web-push";
import mongoose from "mongoose";
import subscriber from "../src/models/subscriber";
import { connectDb } from "./lib/connectDb";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200,
}));
app.use(morgan("dev"));

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI as string).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const vapidKeys = {
    publicKey: "BIUDaysf-IsuDNl1GhhDqCLb13GSW2kRdSaKHw8ooiHUEPWDSQUIWJvPIyPVcP9FMv1NJi5_O-SeBPDxR_4xTMY",
    privateKey: "-hMLvKmiN_l7VIz2sqRC5sJRNRNayAncazIk_ayLlFU",
};

// const vapidKeys = webPush.generateVAPIDKeys();

// const VAPID_PBLC_KEY="BIUDaysf-IsuDNl1GhhDqCLb13GSW2kRdSaKHw8ooiHUEPWDSQUIWJvPIyPVcP9FMv1NJi5_O-SeBPDxR_4xTMY";
// const VAPID_PRVT_KEY="-hMLvKmiN_l7VIz2sqRC5sJRNRNayAncazIk_ayLlFU";

app.get("/", async (req, res, next) => {
    // RESPOND IF CONNECTED TO MONGODB
    if (mongoose.connection.readyState === 1) {
        res.status(200).json({
            message: "Connected to MongoDB",
        });
    } else {
        res.status(500).json({
            message: "Error connecting to MongoDB",
        });
    }
});

// send public key to client
app.get("/getSubscribe", async (req, res, next) => {
    res.status(200).json({
        publicKey: vapidKeys.publicKey,
    });
});

// save subscription to mongodb
app.post("/postSubscribe", async (req, res, next) => {
    const saveDataPayload = {
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey,
        userId: req.body.userId,
        app: req.body.app,
        subscription: req.body.subscription,
    };
    console.log(saveDataPayload);
    // check if subscriber already exists in mongodb
    const existingSubscriber = await subscriber.findOne({ "subscription.endpoint": saveDataPayload.subscription.endpoint });
    if (existingSubscriber) {
        res.status(201).json({
            message: "Subscriber already exists",
            subscriberPublicKey: existingSubscriber.publicKey,
        });
        return;
    }
    // save subscriberPayload to mongodb
    await subscriber.create(saveDataPayload).then((subscriber) => {
        res.status(201).json({
            message: "Subscriber created successfully",
            subscriberPublicKey: subscriber.publicKey,
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error creating subscriber",
            error: err,
        });
    });
});

app.post("/sendNotification", async (req, res, next) => {
    const notificationPayload = {
        notification: {
            title: req.body.title,
            body: req.body.body,
            icon: "https://cdn-icons-png.flaticon.com/512/8297/8297354.png",
        },
    };



    const subscription = {
        endpoint: "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABlXGYv6Wn2dwvxESXpfmifdbWSw4bRLlnVO5dxpwHZeH_fAWfe8txEOH5LVSXIveh7r96Vbo4y59sOY6pctbVX6EvCcKoH-0Jk6Cw6FvEbVW6vwOJJdhKJB_RWmL3wm3UTE0tEB4ZtFrpRltwrEK35gBYay-7eWHMuhIdLl2CRKn_w8bA",
        expirationTime: null,
        keys: {
          auth: "H6W6lIzMRLHRSPlTY7MmTw",
          p256dh: "BHRi02RBoxC8z8e7jKDtasD6EOUlh21O4PFN68VWvZS_fAgnyyxIgDvEwJbozh0zb5emQuOEMlYlUT9B_yxqDQ8"
        }
      }
      

    webPush.setVapidDetails('mailto:sample@mail.com', vapidKeys.publicKey, vapidKeys.privateKey);
    const sendNotif = await webPush.sendNotification(subscription, JSON.stringify(notificationPayload));

    res.status(200).json({
        ...sendNotif
    });

    // get all subscribers
    // const subscribers = await subscriber.find();
    // send notification to all subscribers
    // const response = await Promise.all(subscribers.map((subscriber) => {
    //     console.log(subscriber);
    //     webPush.setVapidDetails('mailto:sample@mail.com', vapidKeys.publicKey, vapidKeys.privateKey);
    //     webPush.sendNotification(subscriber.subscription, JSON.stringify(notificationPayload)).then(() => {
    //         console.log("Notification sent successfully");
    //     }).catch((err) => {
    //         console.log("Error sending notification");
    //         console.log(err);
    //     });
    // }));

    // console.log(response);
    // res.status(200).json({
    //     response,
    // });
});

// delete all subscribers
app.delete("/deleteSubscribers", async (req, res, next) => {
    await subscriber.deleteMany().then(() => {
        res.status(200).json({
            message: "Subscribers deleted successfully",
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting subscribers",
            error: err,
        });
    });
});

export default app;