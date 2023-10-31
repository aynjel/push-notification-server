import { TPushNotification } from "../types/Types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PushNotificationSchema = new Schema({
    title: String,
    body: String,
    data: {
        type: Map,
        of: String,
    },
});

export default mongoose.model<TPushNotification>(
    "PushNotification",
    PushNotificationSchema
);