const authUtil = require('./authutil')
const userpost = require('./userpost')

/**
 * handles login
 * @param {object} req
 * @param {object} res
 */
async function handleLogin(req, res) {
    const loginres = await authUtil.userLogin(req, res)
    return loginres
}

/**
 * handleSignup
 * @param {object} req
 * @param {object} res
 */
async function handleSignup(req, res) {
    const usersign = await authUtil.userSignUp(req, res)
    return usersign
}

/**
 * handleForgotPassword
 * @param {object} req
 * @param {object} res
 */
async function handleForgotPassword(req, res) {
    const forgetpass = await authUtil.userForgotPassword(req, res)
    return forgetpass
}

/**
 * handleResetPassword
 * @param {object} req
 * @param {object} res
 */
async function handleResetPassword(req, res) {
    const forgotres = await authUtil.userResetPassword(req, res)
    return forgotres
}


/**
 * handleUserPost
 * @param {object} req
 * @param {object} res
 */
async function userPost(req, res) {
    const postres = await userpost.userPost(req, res)
    return postres
}

/**
 * handleRetrievePosts
 * @param {object} req
 * @param {object} res
 */
async function retrievePosts(req, res) {
    const retrieveres = await userpost.retrievePosts(req, res)
    return retrieveres
}

module.exports = {
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleResetPassword,
    userPost,
    retrievePosts,
};
