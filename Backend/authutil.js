const bcrypt = require('bcryptjs');
const transporter = require('./models/transporter');
const User = require('./models/User');

/**
 * Function for user login
 */
async function userLogin(req, res) {
    try {
        const { username, password } = req.body;

        //Not provided then send Respond with a 400 Bad Request if data is missing
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        
        // Find the user by the provided username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

         //Send respond with a 401 Unauthorized if the password doesn't match
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }
        // Respond with a success message if login is successful
        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
    
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function for user SignUp
 */
async function userSignUp(req, res) {
    try {
        const { name,username, password } = req.body;

        // Check if name, username, and password are provided
        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Name and Username and password are required.' });
        }

        // Hash the provided password for security
        const hashedPassword = await bcrypt.hash(password, 10);

         // Create a new user with the hashed password
        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        // Save the new user in the database
        await newUser.save();

        // Send Respond if user creation is successful
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function for user forgot password
 */
async function userForgotPassword(req, res) {
    const { email } = req.body;

    // Check if email is provided or not
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // Find the user by the provided email
        const user = await User.findOne({ username: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        // Generate a password reset token
        const resetToken = generateResetToken();
        // Send a password reset email with the reset token
        await sendPasswordResetEmail(email, resetToken);
        // Update the user's reset token in the database
        await updateUserResetToken(user._id, resetToken);
        // Send Respond  Password reset mail sent successful
        return res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Function for user ResetPassword
 */
async function userResetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;
    // Find the user by the provided reset token and ensure it's not expired
    const user = await User.findOne({
        token: token,
        tokenexpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    // Hash the new password for security
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user details in the database
    await user.save();
    // Send Respond  Password reset successful
    res.status(200).json({ message: 'Password reset successful.' });
}


function generateResetToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 32;
    let token = '';
    //generate a reset token
    for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

async function sendPasswordResetEmail(email, resetToken) {
    const mailOptions = {
        //From email details
        from: 'agrocom0532@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `To reset your password, use it token ${resetToken}`,
    };

    try {
        //Email will sent by transporter with the Mail options
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.response);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

async function updateUserResetToken(userId, resetToken) {
    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (user) {
            // Update the reset token and its expiration date for the user
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);
            await User.updateOne({_id:userId},{$set:{token:resetToken,tokenexpire:user.resetPasswordExpires}}) 
            console.log('User reset token updated successfully.');
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error('Error updating user reset token:', error);
    }
}

module.exports = {
    userLogin,
    userSignUp,
    userForgotPassword,
    userResetPassword,
};