import admin from "firebase-admin";
import config from "../../config.js";
export function verifySessionCookieMiddleware(req, res, next) {
  if (req.path === "/sessionLogin" || req.path === "/login") {
    return next();
  }
  const sessionCookie = req.cookies.session || ""; // Lấy session cookie từ request
  // Verify the session cookie
  console.log("vao middleware");
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      // Nếu session cookie hợp lệ, decodedClaims sẽ chứa thông tin xác thực về người dùng
      // Lưu thông tin này vào request để các middleware hoặc route handler sau này có thể sử dụng
      req.user = decodedClaims;
      console.log("chui vao then");
      next(); // Chuyển sang middleware hoặc route handler tiếp theo
    })
    .catch((error) => {
      console.log("loi verify");
      res.set("Access-Control-Allow-Origin", req.headers.origin);
      return res.status(400).send("login");
    });
}
