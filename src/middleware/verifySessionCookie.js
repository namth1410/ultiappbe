import admin from "firebase-admin";
import config from "../../config.js";
export function verifySessionCookieMiddleware(req, res, next) {
  if (req.path === "/sessionLogin") {
    return next();
  }
  const sessionCookie = req.cookies.session || ""; // Lấy session cookie từ request
  // Verify the session cookie
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      // Nếu session cookie hợp lệ, decodedClaims sẽ chứa thông tin xác thực về người dùng
      // Lưu thông tin này vào request để các middleware hoặc route handler sau này có thể sử dụng
      req.user = decodedClaims;
      next(); // Chuyển sang middleware hoặc route handler tiếp theo
    })
    .catch((error) => {
      console.log("loi verify");
      return res.redirect(config.redirectUrl);// Hoặc res.redirect('/login');
    });
}
