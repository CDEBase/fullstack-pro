

/**
 * All the unique identifier to be used when normilizing the data in the store.
 * Refer: https://www.apollographql.com/docs/angular/basics/caching#configuration
 * We define it as Object and use a helper method to convert.
 * ex: const dataIdFromObject = {
 *  'ICounter': (result) => result.__typename + ':' + result._id,
 * }
 */
export const dataIdFromObject = {

};
