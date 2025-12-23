import express from "express";
import mantleRoutes from "./routes/mantle.routes";
import { initDB } from "./db";

const app = express();

app.use(express.json());
app.use("/api", mantleRoutes);

const PORT = 3000;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); 

