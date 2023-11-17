import dotenv from "dotenv";
import app from "./index";

dotenv.config();

const port = process.env.PORT || 3050;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});