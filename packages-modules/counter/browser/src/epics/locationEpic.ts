import { ofType } from 'redux-observable';
import { map, tap } from 'rxjs/operators';
import { LOCATION_CHANGE } from '@cdmbase/redux-data-router';

// Assuming LOCATION_CHANGE action type and a dummy action creator for demonstration
// const LOCATION_CHANGE = 'LOCATION_CHANGE';
const dummyAction = () => ({ type: 'DUMMY_ACTION' });

export const locationChangeEpic = (action$) =>
    action$.pipe(
        ofType(LOCATION_CHANGE),
        tap(() => console.log('Location changed!')), // Side effect: logging to the console
        map(() => dummyAction()), // Dispatch a dummy action (replace with your actual follow-up action)
    );
