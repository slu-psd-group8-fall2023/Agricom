const bcrypt = require('bcryptjs');
const { userLogin,userSignUp } = require('../authutil');
const User = require('../models/User');

// Mocking the necessary modules
jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));
jest.mock('../models/transporter', () => ({}));
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
}));

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

    it('should return 500 Internal Server Error on server error', async () => {
        const req = { body: { username: 'existing', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockRejectedValue(new Error('Some database error'));

        await userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});








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

    // it('should create a new user when valid data is provided', async () => {
    //     const req = {
    //         body: {
    //             name: 'John Doe',
    //             username: 'johndoe',
    //             password: 'password',
    //         },
    //     };

    //     const res = {
    //         status: jest.fn(() => ({ json: jest.fn() })),
    //     };
    //     const bcryptHashMock = jest.fn(() => 'hashedPassword');
    //     bcrypt.hash = bcryptHashMock;

    //     await userSignUp(req, res);

    //     // You can add assertions here to check if the user was created correctly
    //     const createdUser = await User.findOne({ username: 'johndoe' });
    //     expect(createdUser).not.toBeNull();
    // });
    


    it('should return 500 Internal Server Error on server error', async () => {
        const req = { body: { name: 'John Doe', username: 'johndoe', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await userSignUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
