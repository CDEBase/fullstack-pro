// @flow weak
// By feature import doesn't work in Node.js.
// firebase.google.com/docs/web/setup
// Tested with 3.6.4, it still doesn't work.
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
import firebase from 'firebase';
import validate from './validate';

/*
  Removed firebase dependencies
 */

const configureDeps = (initialState, platformDeps) => ({
  ...platformDeps,
  ...createFirebaseDeps(initialState.config.firebase),
  getUid: () => platformDeps.uuid.v4(),
  now: () => Date.now(),
  validate,
});

export default configureDeps;
