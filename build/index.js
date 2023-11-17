"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const web_push_1 = __importDefault(require("web-push"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get("/", (req, res, next) => {
    console.log("API is working");
    console.log(process.env.PORT);
    console.log(web_push_1.default.generateVAPIDKeys());
});
app.get("/subscribe", (req, res, next) => {
    console.log("Subscribe API is working");
});
app.post("/send", (req, res, next) => {
    console.log("Send API is working");
    // const payLoad = {
    //     notification: {
    //         data: { url: req.body.url },
    //         title: req.body.title,
    //         vibrate: [100, 50, 100]
    //     },
    // };
    // webPush.setVapidDetails('mailto:sdfs@sd.com', publicKey, privateKey);
    // webPush.sendNotification(req.body, JSON.stringify(payLoad))
    // .then((result) => {
    //     console.log(result);
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
    // res.redirect("/");
});
exports.default = app;
