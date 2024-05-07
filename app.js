import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import admin from "firebase-admin";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { appendFile } from "fs/promises";
import http from "http";
import { dirname, join } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import config from "./config.js";
import { firestore } from "./firebase.js";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import { verifyIdTokenMiddleware } from "./src/middleware/verifyIdToken.js";
import classRouter from "./src/routes/classRoutes.js";
import homeworkRoutes from "./src/routes/homeworkRoutes.js";
import memberRoutes from "./src/routes/memberRoutes.js";
import newsfeedRouter from "./src/routes/newsfeedRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ultiapp-255c3.firebaseio.com",
});
const app = express();
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://ultiapp-255c3.web.app",
      "https://ultiapp-255c3.firebaseapp.com",
    ],
  },
});
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ultiapp-255c3.web.app",
    "https://ultiapp-255c3.firebaseapp.com",
    "*",
  ],
};

app.use(cors(corsOptions));
app.use(express.static("public"));

app.use(express.json());

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });
});

app.use("/", verifyIdTokenMiddleware);

app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${
    req.url
  } - IP: ${req.socket.remoteAddress}\n`;

  appendFile(join(__dirname, "public", "log.txt"), logMessage).catch((err) => {
    console.error("Error writing to log file:", err);
  });

  next();
});

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

app.post("/login", async (req, res) => {
  try {
    const user = req.user;
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("uid", "==", user.uid))
    );

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(usersRef, docId), {
        uid: user.uid,
        displayName: user.name,
        email: user.email,
        profilePic: user.picture,
      });
    } else {
      await addDoc(usersRef, {
        uid: user.uid,
        displayName: user.name,
        email: user.email,
        profilePic: user.picture,
      });
    }

    res.status(200).send("User information updated successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/classes", classRouter);
app.use("/newsfeed", newsfeedRouter);
app.use("/member", memberRoutes);
app.use("/homework", homeworkRoutes);

app.post("/logout", (req, res) => {
  const { uid } = req.user;
  admin
    .auth()
    .revokeRefreshTokens(uid)
    .then(() => {
      console.log("Đã hủy bỏ refresh token thành công");
    })
    .catch((error) => {
      console.error("Lỗi khi hủy bỏ refresh token:", error);
    });
  res.sendStatus(200);
});

server.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`)
);

export { io };
