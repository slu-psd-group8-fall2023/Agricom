const authUtil = require('./authutil')

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

module.exports = {
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleResetPassword,
};
