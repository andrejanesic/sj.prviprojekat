/**
 * Data Model Interfaces
 */
import {Model, Sequelize} from 'sequelize';


/**
 * In-Memory Store
 */


/**
 * Service Methods
 */

/**
 * Find a model by ID from database.
 * @param model Model type.
 * @param id Object ID.
 */
export async function find(model: typeof Model, id: number): Promise<any> {

}

/**
 * Find a model by ID from database. Alias for {@link find} function.
 */
export const findId = find;

/**
 * Find a model by UUID from database.
 * @param model Model type.
 * @param uuid Object UUID.
 */
export async function findUuid(model: typeof Model, uuid: string): Promise<any> {

}

/**
 * Creates a new object of model type in database.
 * @param model Model type.
 * @param parameters Query parameters.
 */
export async function create(model: typeof Model, parameters: any): Promise<any> {

}

/**
 * Updates an object of model type in database.
 * @param model Model type.
 * @param parameters Query parameters.
 */
export async function update(model: typeof Model, parameters: any): Promise<any> {

}

/**
 * Removes an object of model type from database.
 * @param model Model type.
 * @param parameters Query parameters.
 */
export async function remove(model: typeof Model, parameters: any): Promise<any> {

}