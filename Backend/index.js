const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const transporter = require('./models/transporter')
const db = require('./models/db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

db();

const User = require('./models/User');

app.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/signup', async(req, res) => {
    try {
        const { name,username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Name and Username and password are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/forgot-password', async(req, res) => {
    const { email } = req.body;


    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ username: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const resetToken = generateResetToken();
        await sendPasswordResetEmail(email, resetToken);

        await updateUserResetToken(user._id, resetToken);

        return res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/reset-password/:token', async(req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
        token: token,
        tokenexpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
});

function generateResetToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 32;
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

async function sendPasswordResetEmail(email, resetToken) {
    const mailOptions = {
        from: 'agrocom0532@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `To reset your password, use it token ${resetToken}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.response);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

async function updateUserResetToken(userId, resetToken) {
    try {
        const user = await User.findById(userId);
        if (user) {
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);
            let res = await User.updateOne({_id:userId},{$set:{token:resetToken,tokenexpire:user.resetPasswordExpires}}) 
            console.log('User reset token updated successfully.');
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error('Error updating user reset token:', error);
    }
}


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});