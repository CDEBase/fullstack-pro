/**
 * Call this helper inside async test to let promises finish, because they are allways async.
 */
export const nextTick = () => new Promise(resolve => setTimeout(resolve, 200));
