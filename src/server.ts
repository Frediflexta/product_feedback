import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import router from './router';
import { login } from './controllers/users';
import { bouncer } from './utils/auth';
import { validateLogin, validationError } from './utils/validators';
import { httpResponse } from './utils/httpResponse';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev')); // it's a middleware that logs to the terminal
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-v1', bouncer, router);

app.get('/', (req, res) => {
  res.send('Hello Product Feedback!');
});

app.post('/login', validateLogin(), validationError, login);

app.use('*', (req, res) =>
  httpResponse(res, 404, false, 'Route does not exist')
);

export default app;
