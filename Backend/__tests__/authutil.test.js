const bcrypt = require('bcryptjs');
const { userLogin,userSignUp } = require('../authutil');
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
