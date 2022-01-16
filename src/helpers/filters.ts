/**
 * Removes confidential parameters from JSON objects prior to being sent from API.
 * @param target Input object.
 * @param toRemove Properties to remove.
 */
export function filter(target: any, toRemove: string[]): any {
    if (target == null)
        return null;

    if (Array.isArray(target)) {
        for (let t in target) {
            if (typeof t === 'object')
                toRemove.forEach(s => {
                    if (Object.keys(t).indexOf(s) != -1) {
                        // @ts-ignore
                        delete t[s];
                    }
                });
        }
    } else {
        toRemove.forEach(s => {
            if (Object.keys(target).indexOf(s) != -1) {
                delete target[s];
            }
        });
    }
    return target;
}