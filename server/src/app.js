import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';


export const plaid = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],   
    baseOptions: {
      headers: {                                         
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

import loginAuthRouter from './routes/LoginAuthRoutes.js';
import dbRouter from './routes/dbRoutes.js';
import plaidRouter from './routes/plaidRoutes.js';

const app = express();
const port = 5500;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/auth', loginAuthRouter);
app.use('/db', dbRouter);
app.use('/', plaidRouter);       

app.listen(port, () => console.log(`Server running on ${port}`));
