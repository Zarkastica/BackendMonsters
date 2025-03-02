// categoria.controller.test.js

const categoriaController = require('../controllers/categoria.controller');
const Categoria = require('../models/categoria.model');

jest.mock('../models/categoria.model');

describe('Categoria Controller', () => {
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

  describe('createCategoria', () => {
    it('deberia crear una nueva categoria', async () => {
      mockReq.body = { nombre: 'Test Category' };
      Categoria.prototype.save.mockResolvedValue({});

      await categoriaController.createCategoria(mockReq, mockRes);

      expect(Categoria.prototype.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Categoria añadida exitosamente' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.body = { nombre: 'Test Category' };
      Categoria.prototype.save.mockRejectedValue(new Error('Database error'));

      await categoriaController.createCategoria(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });

  describe('readAllCategorias', () => {
    it('deberia mostrar todas las categories', async () => {
      const mockCategorias = [{ nombre: 'Category 1' }, { nombre: 'Category 2' }];
      Categoria.find.mockResolvedValue(mockCategorias);

      await categoriaController.readAllCategorias(mockReq, mockRes);

      expect(Categoria.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ categorias: mockCategorias });
    });

    it('deberia devolver un error de servidor', async () => {
      Categoria.find.mockRejectedValue(new Error('Database error'));

      await categoriaController.readAllCategorias(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });

  describe('updateCategoria', () => {
    it('deberia actualizar una categoria', async () => {
      mockReq.params.id = 'category_id';
      mockReq.body = { nombre: 'Updated Category' };
      const mockCategoria = { _id: 'category_id', nombre: 'Updated Category' };
      Categoria.findByIdAndUpdate.mockResolvedValue(mockCategoria);

      await categoriaController.updateCategoria(mockReq, mockRes);

      expect(Categoria.findByIdAndUpdate).toHaveBeenCalledWith('category_id', { nombre: 'Updated Category' }, { new: true });
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Categoria actualizada exitosamente', categoria: mockCategoria });
    });

    it('deberia devolver un error si no encuentra la categoria', async () => {
      mockReq.params.id = 'category_id';
      mockReq.body = { nombre: 'Updated Category' };
      Categoria.findByIdAndUpdate.mockResolvedValue(null);

      await categoriaController.updateCategoria(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Categoria no encontrada' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.params.id = 'category_id';
      mockReq.body = { nombre: 'Updated Category' };
      Categoria.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      await categoriaController.updateCategoria(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error al actualizar la categoria' });
    });
  });

  describe('deleteCategoria', () => {
    it('deberia eliminar una categoria', async () => {
      mockReq.params.id = 'category_id';
      Categoria.deleteOne.mockResolvedValue({});

      await categoriaController.deleteCategoria(mockReq, mockRes);

      expect(Categoria.deleteOne).toHaveBeenCalledWith({ _id: 'category_id' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Categoria eliminada exitosamente' });
    });

    it('deberia devolver un error de servidor', async () => {
      mockReq.params.id = 'category_id';
      Categoria.deleteOne.mockRejectedValue(new Error('Database error'));

      await categoriaController.deleteCategoria(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Error inesperado' });
    });
  });
});