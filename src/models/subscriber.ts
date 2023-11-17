import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    subscription: {
        type: Object,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    app: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model("Subscriber", SubscriberSchema);