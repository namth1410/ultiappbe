import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import express from "express";
import admin from "firebase-admin";
import { collection, getDocs, query } from "firebase/firestore";
import config from "./config.js";
import { firestore } from "./firebase.js";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import { verifySessionCookieMiddleware } from "./src/middleware/verifySessionCookie.js";
import classRouter from "./src/routes/classRoutes.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ultiapp-255c3.firebaseio.com",
});
const csrfMiddleware = csrf({ cookie: true });
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(csrfMiddleware);
const corsOptions = {
  origin: ["http://localhost:3000", "https://ultiapp-255c3.web.app"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", verifySessionCookieMiddleware);

app.use("/classes", classRouter);

// app.all("*", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = {
          maxAge: expiresIn,
          httpOnly: false,
          secure: true,
          sameSite: "none",
          domain: ["ultiapp-255c3.web.app", "ultiappbe.onrender.com"],
        };
        res.setHeader("Access-Control-Allow-Private-Network", "true");

        res.cookie("session", sessionCookie, options);
        console.log(sessionCookie);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        console.log(error);
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.post("/sessionLogout", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  res.clearCookie("session");
  admin
    .auth()
    .verifySessionCookie(sessionCookie)
    .then((decodedClaims) => {
      return admin.auth().revokeRefreshTokens(decodedClaims.sub);
    })
    .then(() => {
      console.log("1");
      res.set("Access-Control-Allow-Origin", req.headers.origin);

      return res.status(400).send("login");
      // return res.status(302).location(config.redirectUrl).end();
    })
    .catch((error) => {
      console.log("2");
      return res.status(400).send("login");
      // return res.status(302).location(config.redirectUrl).end();
    });
});

const checkCookie = (req, res, next) => {
  if (!req.cookies.session) {
    res.redirect(config.redirectUrl);
  } else {
    next();
  }
};

app.get("/getClasses", checkCookie, async (req, res) => {
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
