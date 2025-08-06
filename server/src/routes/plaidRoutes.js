import express from "express";
import { verifyJWT } from "../services/login.js";
import {get_trans, linktoken_func} from "../controllers/plaidController.js";
import {exchange_token_func} from "../controllers/plaidController.js";
import { get_accounts_plaid } from "../controllers/plaidController.js";

const plaidRouter = express.Router();

const endpoint_create_token = "/plaid/create_link_token";
const endpoint_exchange_public_token = "/plaid/exchange_public_token";
const endpoint_get_trans = "/plaid/transactions";
const endpoint_get_accounts = "/plaid/get/accounts";

plaidRouter.post(endpoint_create_token,verifyJWT,linktoken_func);


plaidRouter.post(endpoint_exchange_public_token, verifyJWT,exchange_token_func );

plaidRouter.post(endpoint_get_trans, verifyJWT, get_trans );

plaidRouter.get(endpoint_get_accounts, verifyJWT, get_accounts_plaid); 

export default plaidRouter;