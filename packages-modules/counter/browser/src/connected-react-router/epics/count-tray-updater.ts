import { ofType } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap, exhaustMap, pluck, catchError, filter } from 'rxjs/operators';
import { CONNECTED_REACT_ROUTER_ACTION_TYPES } from '../constants';

export const onCountChangedEpic = (
    action$: Observable<any>,
    state$: Observable<any>,
    { services }: { services: any },
) =>
    action$.pipe(
        ofType(CONNECTED_REACT_ROUTER_ACTION_TYPES.INCREMENT),
        exhaustMap(() =>
            state$.pipe(
                pluck(''),
                distinctUntilChanged(),
                tap((x) => console.log('--STATE LOG', x)),
                ofType('TRAY_UPDATED'),
                // services.trayIcon.updateTitle(title);
            ),
        ),
    );
