import JWT from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

function createJwtTokenForUser(user) {
  const payload = {
    fullName: user.fullName,
    userId: user.userId,
    email: user.email,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

export { createJwtTokenForUser, validateToken };
