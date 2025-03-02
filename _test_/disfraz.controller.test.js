// disfraz.controller.test.js

const disfrazController = require('../controllers/disfraz.controller');
const Disfraz = require('../models/disfraz.model');
const Categoria = require('../models/categoria.model');
const fs = require('fs');
jest.useFakeTimers();
jest.mock('../models/disfraz.model');
jest.mock('../models/categoria.model');
jest.mock('fs');



describe('Disfraz Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.mock('fs', () => ({
            renameSync: jest.fn(),
            createReadStream: jest.fn(),
        }));
        mockReq = {
            body: {},
            params: {},
            file: {
                path: 'temp/path',
                originalname: 'test.jpg',
            },
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            pipe: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('AgregarDisfraz', () => {
        it('Deberia agregar un disfraz con exito', async () => {
            mockReq.body = {
                nombre: 'Test Disfraz',
                talla: 'M',
                color: 'Red',
                precio: 50,
                categoria: 'Test Category',
            };
            const mockCategory = { _id: 'category_id' };
            const mockDisfraz = {
                nombre: 'Test Disfraz',
                talla: 'M',
                color: 'Red',
                precio: 50,
                categoria: 'category_id',
                imagen: 'test.jpg',
                save: jest.fn().mockResolvedValue({}),
            };
            disfrazController.saveImage = jest.fn().mockReturnValue(`uploads/${mockReq.file.originalname}`);
            Categoria.findOne.mockResolvedValue(mockCategory);
            Disfraz.prototype.save = mockDisfraz.save;
            Disfraz.prototype.populate = mockDisfraz.populate;
            fs.renameSync.mockReturnValue();

            await disfrazController.AgregarDisfraz(mockReq, mockRes);

            expect(Categoria.findOne).toHaveBeenCalledWith({ nombre: 'Test Category' });
            expect(fs.renameSync).toHaveBeenCalled();
            expect(mockDisfraz.save).toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledWith('Producto agregado exitosamente');
        });

        it('deberia devolver un error porque la categoria no existe', async () => {
            mockReq.body = { categoria: 'No existe' };
            Categoria.findOne.mockResolvedValue(null);

            await disfrazController.AgregarDisfraz(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'La categoría no existe' });
        });

        it('deberia devolver un error de servidor', async () => {
            mockReq.body = { categoria: 'Test Category' };
            Categoria.findOne.mockRejectedValue(new Error('Database error'));

            await disfrazController.AgregarDisfraz(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Hubo un error, contáctanos');
        });
    });

    describe('traerDisfraz', () => {

        it('deberia traer todos los disfraces', async () => {
            const mockDisfraces = [{ nombre: 'Disfraz 1', categoria: 'someCategoryId' }, { nombre: 'Disfraz 2', categoria: 'anotherCategoryId' }];
            const mockFind = {
                populate: jest.fn().mockResolvedValue(mockDisfraces),
            };
            Disfraz.find.mockReturnValue(mockFind);

            await disfrazController.traerDisfraz(mockReq, mockRes);

            expect(Disfraz.find).toHaveBeenCalled();
            expect(mockFind.populate).toHaveBeenCalledWith('categoria');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ disfraces: mockDisfraces });
        });

        it('deberia devolver un error de servidor', async () => {
            const mockFind = {
                populate: jest.fn().mockRejectedValue(new Error('Database error')),
            };
        
            Disfraz.find.mockReturnValue(mockFind);
        
            await disfrazController.traerDisfraz(mockReq, mockRes);
        
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Hubo un error en el servidor' });
        });
    });

    describe('traerDisfrazPorId', () => {
        it('deberia devolver un disfraz con el id', async () => {
            mockReq.params.id = 'disfraz_id';
            const mockDisfraz = { nombre: 'Test Disfraz' };
            Disfraz.findById.mockResolvedValue(mockDisfraz);

            await disfrazController.traerDisfrazPorId(mockReq, mockRes);

            expect(Disfraz.findById).toHaveBeenCalledWith('disfraz_id');
            expect(mockRes.json).toHaveBeenCalledWith(mockDisfraz);
        });

        it('deberia devolver un error al no encontrar el disfraz', async () => {
            mockReq.params.id = 'disfraz_id';
            Disfraz.findById.mockResolvedValue(null);

            await disfrazController.traerDisfrazPorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Producto no encontrado' });
        });

        it('deberia devolver un error de servidor', async () => {
            mockReq.params.id = 'disfraz_id';
            Disfraz.findById.mockRejectedValue(new Error('Database error'));

            await disfrazController.traerDisfrazPorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Hubo un error con el servidor :(');
        });
    });

    describe('actualizarDisfrazPorId', () => {
        it('deberia actualizar un disfraz con el id', async () => {
            mockReq.params.id = 'disfraz_id';
            mockReq.body = { nombre: 'Updated Disfraz' };
            const mockDisfraz = { nombre: 'Updated Disfraz' };
            Disfraz.findByIdAndUpdate.mockResolvedValue(mockDisfraz);

            await disfrazController.actualizarDisfrazPorId(mockReq, mockRes);

            expect(Disfraz.findByIdAndUpdate).toHaveBeenCalledWith('disfraz_id', { nombre: 'Updated Disfraz' });
            expect(mockRes.json).toHaveBeenCalledWith(mockDisfraz);
        });

        it('deberia devolver un error al no encontrarlo', async () => {
            mockReq.params.id = 'disfraz_id';
            Disfraz.findByIdAndUpdate.mockResolvedValue(null);

            await disfrazController.actualizarDisfrazPorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Producto no encontrado' });
        });

        it('deberia devolver un error de servidor', async () => {
            mockReq.params.id = 'disfraz_id';
            Disfraz.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            await disfrazController.actualizarDisfrazPorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Hubo un error con el servidor :(');
        });
    });

    describe('eliminarDisfrazPorId', () => {
        it('deberia eliminar un disfraz con el id', async () => {
            mockReq.params.id = 'disfraz_id';
            const mockDisfraz = { nombre: 'Deleted Disfraz' };
            Disfraz.findByIdAndDelete.mockResolvedValue(mockDisfraz);

            await disfrazController.eliminarDisfrazPorId(mockReq, mockRes);

            expect(Disfraz.findByIdAndDelete).toHaveBeenCalledWith('disfraz_id');
            expect(mockRes.json).toHaveBeenCalledWith(mockDisfraz);
        });

        it('deberia devolver un error al no encontrar el disfraz', async () => {
            mockReq.params.id = 'disfraz_id';
            Disfraz.findByIdAndDelete.mockResolvedValue(null);

            await disfrazController.eliminarDisfrazPorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Producto no encontrado' });
        });

        it('deberia devolver un error de servidor', async () => {
            mockReq.params.id = 'disfraz_id';
            Disfraz.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            await disfrazController.eliminarDisfrazPorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Hubo un error con el servidor :(');
        });
    });

    describe('getImage', () => {
        it('deberia devolver una imagen', () => {
            mockReq.params.name = { imagen: 'test.jpg' };
            const mockReadStream = { pipe: jest.fn() };
            fs.createReadStream.mockReturnValue(mockReadStream);

            disfrazController.getImage(mockReq, mockRes);

            expect(fs.createReadStream).toHaveBeenCalledWith('uploads/test.jpg');
            expect(mockReadStream.pipe).toHaveBeenCalledWith(mockRes);
        });
    });
});