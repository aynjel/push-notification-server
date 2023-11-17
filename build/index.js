"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const web_push_1 = __importDefault(require("web-push"));
const mongoose_1 = __importDefault(require("mongoose"));
const subscriber_1 = __importDefault(require("./models/subscriber"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
    optionsSuccessStatus: 200,
}));
app.use((0, morgan_1.default)("dev"));
// connect to mongodb
mongoose_1.default.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});
const vapidKeys = web_push_1.default.generateVAPIDKeys();
// send public key to client
app.get("/getSubscribe", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        publicKey: vapidKeys.publicKey,
    });
}));
// save subscription to mongodb
app.post("/postSubscribe", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    // check if subscriber already exists in mongodb
    const existingSubscriber = yield subscriber_1.default.findOne({ "subscription.endpoint": data.subscription.endpoint });
    if (existingSubscriber) {
        res.status(201).json({
            message: "Subscriber already exists",
            subscriberPublicKey: existingSubscriber.publicKey,
        });
        return;
    }
    // save subscriberPayload to mongodb
    yield subscriber_1.default.create({
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
}));
app.post("/sendNotification", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationPayload = {
        notification: {
            title: req.body.title,
            body: req.body.body,
            icon: "https://cdn-icons-png.flaticon.com/512/8297/8297354.png",
        },
    };
    // get all subscribers
    const subscribers = yield subscriber_1.default.find();
    // send notification to all subscribers
    Promise.all(subscribers.map((subscriber) => {
        web_push_1.default.setVapidDetails('mailto:sample@mail.com', vapidKeys.publicKey, vapidKeys.privateKey);
        web_push_1.default.sendNotification(subscriber.subscription, JSON.stringify(notificationPayload)).then(() => {
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
}));
// delete all subscribers
app.delete("/deleteSubscribers", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield subscriber_1.default.deleteMany().then(() => {
        res.status(200).json({
            message: "Subscribers deleted successfully",
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting subscribers",
            error: err,
        });
    });
}));
exports.default = app;
