import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { db } from "./config";
import { movieRoute } from "./routes";
import { errorHandler } from "./middleware";
import path from "path";

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/Movies", movieRoute);


app.use(errorHandler);


(async () => {
    try {
        await db.authenticate();
        console.log('DB connected.');
        db.sync().then(() => {
            app.listen(port, () => {
                console.log(`Server is running on ${port}`);
            });
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
