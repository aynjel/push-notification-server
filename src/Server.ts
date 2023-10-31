import dotenv from "dotenv";
import { App } from "./App";

class Server {
    constructor() {
        dotenv.config();
        const app = new App();
        app.start();
    }
}

new Server();