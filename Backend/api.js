const authUtil = require("./authutil");
const userpost = require("./userpost");
const marketpost = require("./marketuserpost.js");

/**
 * handles login
 * @param {object} req
 * @param {object} res
 */
async function handleLogin(req, res) {
  const loginres = await authUtil.userLogin(req, res);
  return loginres;
}

/**
 * handleSignup
 * @param {object} req
 * @param {object} res
 */
async function handleSignup(req, res) {
  const usersign = await authUtil.userSignUp(req, res);
  return usersign;
}

/**
 * handleForgotPassword
 * @param {object} req
 * @param {object} res
 */
async function handleForgotPassword(req, res) {
  const forgetpass = await authUtil.userForgotPassword(req, res);
  return forgetpass;
}

/**
 * handleResetPassword
 * @param {object} req
 * @param {object} res
 */
async function handleResetPassword(req, res) {
  const forgotres = await authUtil.userResetPassword(req, res);
  return forgotres;
}

/**
 * handleUserPost
 * @param {object} req
 * @param {object} res
 */
async function userPost(req, res) {
  const postres = await userpost.userPost(req, res);
  return postres;
}

/**
 * handleRetrievePosts
 * @param {object} req
 * @param {object} res
 */
async function retrievePosts(req, res) {
  const retrieveres = await userpost.retrievePosts(req, res);
  return retrieveres;
}

/**
 * handleAddCommentToPost
 * @param {object} req
 * @param {object} res
 */
async function addCommentToPost(req, res) {
  const commentres = await userpost.addCommentToPost(req, res);
  return commentres;
}

/**
 * handleAddCommentToPost
 * @param {object} req
 * @param {object} res
 */
async function getCommentsForPost(req, res) {
  const getres = await userpost.getCommentsForPost(req, res);
  return getres;
}

/**
 * handles MarketUserPost
 * @param {object} req
 * @param {object} res
 */
async function MarketUserPost(req, res) {
  const postres = await marketpost.marketcreatePost(req, res);
  return postres;
}

/**
 * Handle retrieveMarketPosts
 * @param {object} req
 * @param {object} res
 */
async function retrieveMarketPosts(req, res) {
  const retrievepostres = await marketpost.retrieveMarketPosts(req, res);
  return retrievepostres;
}

/**
 * Handle filterMarketPosts
 * @param {object} req
 * @param {object} res
 */
async function filterMarketPosts(req, res) {
  const filterpostres = await marketpost.filterMarketPosts(req, res);
  return filterpostres;
}

/**
 * Handle deleteMarketPosts
 * @param {object} req
 * @param {object} res
 */
async function deleteMarketPosts(req, res) {
  const deletepostres = await marketpost.deleteMarketPost(req, res);
  return deletepostres;
}

module.exports = {
  handleLogin,
  handleSignup,
  handleForgotPassword,
  handleResetPassword,
  userPost,
  retrievePosts,
  addCommentToPost,
  getCommentsForPost,
  MarketUserPost,
  retrieveMarketPosts,
  filterMarketPosts,
  deleteMarketPosts,
};
