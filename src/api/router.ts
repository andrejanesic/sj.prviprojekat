/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';

dotenv.config();

/**
 * Router Definition
 */
export const router = express.Router();
connect();

/**
 * Controller Definitions
 */

// GET items

// GET items/:id

// POST items

// PUT items/:id

// DELETE items/:id

// ERROR
function error() {
}