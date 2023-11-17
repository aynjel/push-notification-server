import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let mongoClient: MongoClient;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

export async function connectDb() {
    try{
        if(mongoClient) return mongoClient;
        mongoClient = await (new MongoClient(uri, options)).connect();
        console.log("Connected to MongoDB");
        return mongoClient;
    }catch(err){
        console.log(err)
    }
}
