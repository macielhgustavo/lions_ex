import express from 'express';
import { ProductController } from './controllers/product.controller';
import { UserController } from './controllers/user.controller';
import { errorHandler } from './middlewares/error-handler.middleware';
import { UserRepository } from './repositories/user.repository';
import { ProductService } from './services/product.service';
import { UserService } from './services/user.service';

const app = express();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const productService = new ProductService();
const userController = new UserController(userService);
const productController = new ProductController(productService);

app.use(express.json());
app.get('/users', userController.list);
app.get('/users/:id', userController.get);
app.post('/users', userController.create);
app.put('/users/:id', userController.update);
app.delete('/users/:id', userController.delete);
app.get('/products', productController.list);
app.get('/products/:id', productController.get);
app.post('/products', productController.create);
app.put('/products/:id', productController.update);
app.delete('/products/:id', productController.delete);
app.use(errorHandler);
app.listen(3012, () => console.log('Servidor do exercício 12 na porta 3012'));
