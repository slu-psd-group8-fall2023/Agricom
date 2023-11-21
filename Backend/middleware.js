/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
  const origin = req.headers.origin;

  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS, XMODIFY"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  next();
}

/**
 * Handle errors
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function handleError(err, req, res, next) {
  // Log the error to our server's console
  console.error(err);

  // If the response has already been sent, we can't send another response
  if (res.headersSent) {
    return next(err);
  }

  // Send a 500 error response
  res.status(500).json({ error: "Internal Error Occurred" });
}

module.exports = {
  cors,
  handleError,
};
