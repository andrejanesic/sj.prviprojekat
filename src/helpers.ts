/**
 * Helper functions.
 */
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Returns the environment key. If not present, returns defaultValue if set.
 * @param key Environment key.
 * @param defaultValue Default value. Optional.
 */

export function env(key: string, defaultValue: any = null) {
    if ('ENVIRONMENT' in process.env && process.env.ENVIRONMENT != null) {
        let envKey = key + '_' + process.env.ENVIRONMENT.toUpperCase();
        if (envKey in process.env)
            return process.env[envKey];
    }

    if (key in process.env)
        return process.env[key];

    return defaultValue != null ? defaultValue : null;
}