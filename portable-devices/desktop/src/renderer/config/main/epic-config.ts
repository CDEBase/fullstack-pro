import { combineEpics, ofType } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import modules from '../../modules/main';

export const epic$ = new BehaviorSubject(combineEpics(...modules.epics));

// Since we're using mergeMap, by default any new
// epic that comes in will be merged into the previous
// one, unless an EPIC_END action is dispatched first,
// which would cause the old one(s) to be unsubscribed
export const rootEpic = (action$, ...rest) =>
    epic$.pipe<any>(mergeMap((epic) => epic(action$, ...rest).pipe(takeUntil(action$.pipe(ofType('EPIC_END'))))));
