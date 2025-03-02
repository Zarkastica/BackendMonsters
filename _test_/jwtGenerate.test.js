const jwt = require('jsonwebtoken');
const { generateToken } = require('../middlewares/jwtGenerate');

process.env.SECRET_KEY = 'testSecreto';

jest.mock('jsonwebtoken');

describe('jwtGenerate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('deberia generar un token', () => {
      const userData = { username: 'testUser', id: 123 };
      const mockToken = 'mockedToken';

      jwt.sign.mockReturnValue(mockToken);

      const token = generateToken(userData);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userData: userData },
        'testSecreto',
        { expiresIn: '2h' }
      );
      expect(token).toBe(mockToken);
    });

    it('deberia generar un error y mostrarlo en consola', () => {
      const error = new Error('JWT Error');
      jwt.sign.mockImplementation(() => {
        throw error;
      });

      const consoleLogSpy = jest.spyOn(console, 'log');
      consoleLogSpy.mockImplementation(() => {});

      const token = generateToken({ username: 'testUser' });

      expect(jwt.sign).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(token).toBeUndefined();

      consoleLogSpy.mockRestore();
    });
  });
});