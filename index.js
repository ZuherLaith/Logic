import dotenv from 'dotenv';
import { initializeClient } from './Struct/Client.js';

dotenv.config();

const token = process.env.TOKEN;

initializeClient(token);
