const authUtil = require('./authutil')

/**
 * handles login
 * @param {object} req
 * @param {object} res
 */
async function handleLogin(req, res) {
    const loginres = await authUtil.userLogin(req, res)
    res.json(loginres)
}

/**
 * handleSignup
 * @param {object} req
 * @param {object} res
 */
async function handleSignup(req, res) {
    const loginres = await authUtil.userSignUp(req, res)
    res.json(loginres)
}

/**
 * handleForgotPassword
 * @param {object} req
 * @param {object} res
 */
async function handleForgotPassword(req, res) {
    const signupres = await authUtil.userForgotPassword(req, res)
    res.json(signupres)
}

/**
 * handleResetPassword
 * @param {object} req
 * @param {object} res
 */
async function handleResetPassword(req, res) {
    const forgotres = await authUtil.userResetPassword(req, res)
    res.json(forgotres)
}

module.exports = {
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleResetPassword,
};
