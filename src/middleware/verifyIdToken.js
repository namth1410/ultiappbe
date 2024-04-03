import admin from "firebase-admin";
export function verifyIdTokenMiddleware(req, res, next) {
  const idToken = req.headers.authorization;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.log(error);
      console.log("Lỗi xác thực token ở middleware");
      return res.status(401).send("Unauthorized");
    });
}
