import admin from "firebase-admin";
export function verifySessionCookieMiddleware(req, res, next) {
  if (req.path === "/sessionLogin" || req.path === "/login") {
    return next();
  }
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      req.user = decodedClaims;
      next();
    })
    .catch((error) => {
      console.log("loi verify");
      res.set("Access-Control-Allow-Origin", req.headers.origin);
      return res.status(400).send("login");
    });
}
