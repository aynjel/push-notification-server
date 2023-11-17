import express from "express";
import cors from "cors";
import webPush from "web-push";
import mongoose from "mongoose";
import subscriber from "../models/subscriber";
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

const vapidKeys = webPush.generateVAPIDKeys();

// send public key to client
app.get("/getSubscribe", async (req, res, next) => {
    res.status(200).json({
        publicKey: vapidKeys.publicKey,
    });
});

// save subscription to mongodb
app.post("/postSubscribe", async (req, res, next) => {
    const data = req.body;
    console.log(data);
    // check if subscriber already exists in mongodb
    const existingSubscriber = await subscriber.findOne({ "subscription.endpoint": data.subscription.endpoint });
    if (existingSubscriber) {
        res.status(201).json({
            message: "Subscriber already exists",
            subscriberPublicKey: existingSubscriber.publicKey,
        });
        return;
    }
    // save subscriberPayload to mongodb
    await subscriber.create({
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey,
        userId: data.userId,
        app: data.app,
        subscription: data.subscription,
    }).then((subscriber) => {
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
    // get all subscribers
    const subscribers = await subscriber.find();
    // send notification to all subscribers
    Promise.all(subscribers.map((subscriber) => {
        webPush.setVapidDetails('mailto:sample@mail.com', vapidKeys.publicKey, vapidKeys.privateKey);
        webPush.sendNotification(subscriber.subscription, JSON.stringify(notificationPayload)).then(() => {
            console.log("Notification sent successfully");
        }).catch((err) => {
            console.log("Error sending notification");
            console.log(err);
        });
    })).then(() => {
        res.status(200).json({
            message: "Notification sent successfully",
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error sending notification",
            error: err,
        });
    });
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