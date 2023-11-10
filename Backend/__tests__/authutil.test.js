const bcrypt = require('bcryptjs');
const { userLogin,userSignUp,userForgotPassword,userResetPassword} = require('../authutil');
const User = require('../models/User');
// Mocking the necessary modules
jest.mock('bcryptjs', () => ({compare: jest.fn(),}));
jest.mock('../models/transporter', () => ({}));
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
}));


/**
 * Test cases for the UserLogin
 */
describe('userLogin', () => {
    it('should return 400 Bad Request if data is missing', async () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required.' });
    });

    it('should return 404 User not found if the user is not in the database', async () => {
        const req = { body: { username: 'nonexistent', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockResolvedValue(null);

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 401 Unauthorized if the password is incorrect', async () => {
        const req = { body: { username: 'existing', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = { username: 'existing', password: 'hashedPassword' };
        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password.' });
    });

    it('should return 200 Login successful for a valid user', async () => {
        const req = { body: { username: 'existing', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = { username: 'existing', password: 'hashedPassword' };
        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Login successful.' });
    });
});


/**
 * Test cases for the UserSignUP
 */
describe('userSignUp', () => {
    it('should return 400 Bad Request if name, username, or password is missing', async () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await userSignUp(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Name, Username, and password are required.' });
    });

    it('should create a new user when valid data is provided', async () => {
        const req = {
            body: {
                name: 'John Doe',
                username: 'johndoe',
                password: 'password',
            },
        };

        const res = {
            status: jest.fn(() => ({ json: jest.fn() })),
        };
        const bcryptHashMock = jest.fn(() => 'hashedPassword');
        bcrypt.hash = bcryptHashMock;

        await userSignUp(req, res);

        const createdUser = await User.findOne({ username: 'johndoe' });
        expect(createdUser).not.toBeNull();
    });

    it('should handle existing user', async () => {
        // Mock User.findOne to return an existing user
        User.findOne.mockResolvedValue({});
    
        const req = {
            body: {
                name: 'John Doe',
                username: 'johndoe@example.com',
                password: 'password',
            },
        };
    
        const jsonMock = jest.fn();
        const res = {
            status: jest.fn(() => ({ json: jsonMock })),
        };
    
        await userSignUp(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'User already exists on this mail.' });
    });
    
    it('should return 500 Internal Server Error on server error', async () => {
        // Mock User.findOne to simulate a server error
        User.findOne.mockRejectedValue(new Error('Some server error'));
    
        const req = { body: { name: 'John Doe', username: '******', password: '*****' } };
        const jsonMock = jest.fn();
        const res = {
            status: jest.fn(() => ({ json: jsonMock })),
        };
    
        await userSignUp(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});


/**
 * Test cases for the Forgetpassword
 */
describe('userForgotPassword', () => {
  it('Email not provided', async () => {
    const req = { body: { } }; // Missing email in the request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userForgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email is required.' });
  });

  it('User not found', async () => {
    const req = { body: { email: 'nonexistent@example.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userForgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
  it('Error during password reset', async () => {
    const req = { body: { email: 'user@example.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(User, 'findOne').mockImplementationOnce(() => { throw new Error('Some error during password reset.'); });

    await userForgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

});


/**
 * Test cases for the resetpassword
 */
describe('User Password Reset', () => {
    it('should reset the user password and return a 200 status on success', async () => {
        const req = {
          params: {
            token: 'valid-reset-token', // Use a valid reset token
          },
          body: {
            newPassword: 'new-password',
          },
        };
      
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the status method
            json: jest.fn(), // Mock the json method
          };
      
        // Mock the user object with a valid token and expiration date
        const user = {
          token: 'valid-reset-token',
          tokenexpire: new Date(Date.now() + 3600000), // Valid expiration time
          password: 'existing-password', // Existing hashed password
          save: jest.fn(), // Mock the save function
        };
      
        // Mock bcrypt.hash to return the hashed password
        bcrypt.hash.mockResolvedValue('hashed-new-password');
      
        // Mock User.findOne to return the user object
        User.findOne.mockResolvedValue(user);
      
        // Call the function with the defined req and res objects
        await userResetPassword(req, res);
      
        // Assertions
        expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
        expect(user.password).toBe('hashed-new-password');
        expect(user.resetPasswordToken).toBeUndefined();
        expect(user.resetPasswordExpires).toBeUndefined();
        expect(user.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successful.' });
      });


      it('should return a 400 status with an error message for an invalid token', async () => {
        // Mock the request and response objects
        const req = {
            params: {
                token: 'invalid-reset-token', // Use an invalid reset token
            },
            body: {
                newPassword: 'new-password', // Define the newPassword property
            },
        };
    
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the status method
            json: jest.fn(), // Mock the json method
        };
    
        // Mock User.findOne to return null (no user found with the token)
        User.findOne.mockResolvedValue(null);
    
        // Call the function with the defined req and res objects
        await userResetPassword(req, res);
    
        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Password reset token is invalid or has expired.' });
    });
    
    it('should return a 400 status with an error message for an expired token', async () => {
        const req = {
          params: {
            token: 'invalid-reset-token', // Use an invalid reset token
          },
          body: {
            newPassword: 'new-password', // Define the newPassword property
          },
        };
      
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        const user = {
          token: 'expired-reset-token',
          tokenexpire: new Date(Date.now() - 3600000), // Past expiration time
          save: jest.fn(), // Mock the save function
        };
      
        // Mock User.findOne to return the user object
        User.findOne.mockResolvedValue(null);
      
        // Call the function
        await userResetPassword(req, res);
      
        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Password reset token is invalid or has expired.' });
      });
      
});