import cors from "cors";
import express from "express";
import { collection, getDocs, query } from "firebase/firestore";
import config from "./config.js";
import { firestore } from "./firebase.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/getClasses", async (req, res) => {
  try {
    const q = query(collection(firestore, "classes"));
    const querySnapshot = await getDocs(q);
    const classes = [];
    querySnapshot.forEach((doc) => {
      classes.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    if (classes.length > 0) {
      res.status(200).json(classes);
    } else {
      res.status(404).send("Classes not found");
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Error fetching classes" });
  }
});

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`)
);
