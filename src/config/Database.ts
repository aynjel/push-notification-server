import * as mongoose from "mongoose";

export class Database{
    
    constructor(){}

    public async connect(): Promise<void>{
        try{
            await mongoose.connect(process.env.MONGODB_URI as string)
            .then(() => console.log("Connected to database", process.env.MONGODB_URI))
            .catch((error) => console.log("Error connecting to database: ", error));
        }catch(error: any){
            console.log("Error connecting to database: ", error);
            process.exit(1);
        }
    }

    public async disconnect(): Promise<void>{
        try{
            await mongoose.disconnect();
        }catch(error: any){
            console.log("Error disconnecting from database: ", error);
            process.exit(1);
        }
    }
}