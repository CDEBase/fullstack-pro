import { ofType } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap, exhaustMap, pluck, catchError, filter } from 'rxjs/operators';
import { ElectronTypes } from '@common-stack/client-core';
import { CONNECTED_REACT_ROUTER_ACTION_TYPES } from '../constants';

export const onCountChangedEpic = (
    action$: Observable<any>,
    state$: Observable<any>,
    { container, routes }: { container: any; routes },
) =>
    action$.pipe(
        ofType(CONNECTED_REACT_ROUTER_ACTION_TYPES.INCREMENT),
        exhaustMap(() =>
            state$.pipe(
                pluck('connectedReactRouter_counter'),
                distinctUntilChanged(),
                tap((count) => {
                    const st = container.get(ElectronTypes.TrayWindow);
                    st.updateTitle(count.toString());
                }),
                ofType('TRAY_UPDATED'),
            ),
        ),
    );
