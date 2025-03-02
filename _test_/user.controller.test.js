// user.controller.test.js

const userController = require('./../controllers/user.controller');
const User = require('./../models/user.model');
const { generateToken } = require('../middlewares/jwtGenerate');

jest.mock('./../models/user.model');
jest.mock('../middlewares/jwtGenerate');

describe('User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('deberia devolver todos los usuarios', async () => {
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
      User.find.mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockReq, mockRes);

      expect(User.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ users: mockUsers });
    });

    it('should return 500 on error', async () => {
      User.find.mockRejectedValue(new Error('Database error'));

      await userController.getAllUsers(mockReq, mockRes);

      expect(User.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Hubo un error' });
    });
  });

  describe('createUser', () => {
    it('deberia crear un usuario exitosamente', async () => {
      mockReq.body = { username: 'newUser', password: 'password' };
      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue({});

      await userController.createUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'newUser' });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Usuario registrado exitosamente' });
    });

    it('deberia devolver un error si el usuario ya existe', async () => {
      mockReq.body = { username: 'existingUser', password: 'password' };
      User.findOne.mockResolvedValue({ username: 'existingUser' });

      await userController.createUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'existingUser' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'El usuario existingUser ya existe' });
    });

    it('deberia devolver un error si el usuario o la contraseña ya existe', async () => {
      mockReq.body = {};

      await userController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Ingrese usuario y contraseña' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.body = { username: 'newUser', password: 'password' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      await userController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });

  describe('loginUser', () => {
    it('deberia logear el usuario y devolver un token', async () => {
      mockReq.body = { username: 'user', password: 'password' };
      const mockUser = { username: 'user', password: 'password' };
      const mockToken = 'mockToken';

      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockResolvedValue(mockToken);

      await userController.loginUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'user' });
      expect(generateToken).toHaveBeenCalledWith('user', 'password');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Sesion iniciada', token: mockToken });
    });

    it('deberia devolver un error si el usuario no existe', async () => {
      mockReq.body = { username: 'nonexistentUser', password: 'password' };
      User.findOne.mockResolvedValue(null);

      await userController.loginUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentUser' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'El usuario no existe' });
    });

    it('deberia devolver un error si la contraseña es incorrecta', async () => {
      mockReq.body = { username: 'user', password: 'wrongPassword' };
      User.findOne.mockResolvedValue({ username: 'user', password: 'password' });

      await userController.loginUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'user' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Contraseña incorrecta' });
    });

    it('deberia devolver un error si falta el usuario o contraseña', async () => {
      mockReq.body = {};

      await userController.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Ingrese usuario y contraseña' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.body = { username: 'user', password: 'password' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      await userController.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });

  describe('findUser', () => {
    it('deberia encontrar un usuario y devolverlo', async () => {
      mockReq.params.id = 'user';
      const mockUser = { username: 'user', _id: '123' };
      User.findOne.mockResolvedValue(mockUser);

      await userController.findUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'user' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ User: { username: 'user', id: '123' } });
    });

    it('deberia devolver un error si el usuario no existe', async () => {
      mockReq.params.id = 'nonexistentUser';
      User.findOne.mockResolvedValue(null);

      await userController.findUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentUser' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'El usuario no existe' });
    });

    it('deberia devolver un error si falta el usuario', async () => {
      mockReq.params.id = undefined;

      await userController.findUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Ingrese el usuario que desea buscar' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.params.id = 'user';
      User.findOne.mockRejectedValue(new Error('Database error'));

      await userController.findUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });

  describe('updateUser', () => {
    it('deberia actualizar la contraseña', async () => {
      mockReq.body = { username: 'user', password: 'oldPassword', updatedPassword: 'newPassword' };
      User.findOne.mockResolvedValue({ username: 'user', password: 'oldPassword' });
      User.updateOne.mockResolvedValue({});

      await userController.updateUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'user' });
      expect(User.updateOne).toHaveBeenCalledWith({ username: 'user' }, { password: 'newPassword' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Contraseña actualizada exitosamente' });
    });

    it('deberia devolver un error si la contraseña es incorrecta', async () => {
      mockReq.body = { username: 'user', password: 'wrongPassword', updatedPassword: 'newPassword' };
      User.findOne.mockResolvedValue({ username: 'user', password: 'oldPassword' });

      await userController.updateUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'user' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Contraseña incorrecta' });
    });

    it('deberia devolver un error si falta el usuario o la contraseña', async () => {
      mockReq.body = { username: 'user' };

      await userController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Ingrese la contraseña actual y la nueva' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.body = { username: 'user', password: 'oldPassword', updatedPassword: 'newPassword' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      await userController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });

  describe('deleteUser', () => {
    it('deberia eliminar un usuario', async () => {
      mockReq.params.id = 'user';
      User.deleteOne.mockResolvedValue({});

      await userController.deleteUser(mockReq, mockRes);

      expect(User.deleteOne).toHaveBeenCalledWith({ username: 'user' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Usuario eliminado exitosamente' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.params.id = 'user';
      User.deleteOne.mockRejectedValue(new Error('Database error'));

      await userController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });
});