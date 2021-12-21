/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {usersRouter} from './api/usersRouter';
import {licensesRouter} from './api/licensesRouter';
import {campaignsRouter} from './api/campaignsRouter';
import {funnelsRouter} from './api/funnelsRouter';

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/licenses', licensesRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/funnels', funnelsRouter);

/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});