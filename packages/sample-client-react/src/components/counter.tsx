import * as React from 'react'
import * as redux from 'redux'

import { Store } from '@sample/client-redux'

export type OwnProps = {
    label: string,
    store?: redux.Store<Store.All>
}

export type ConnectedState = {
    counter: { value: number }
    isSaving: boolean,
    isLoading: boolean,
    error: string,
}

export type ConnectedDispatch = {
    increment: (n: number) => void
    save: (n: number) => void
    load: () => void
}



export class CounterComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}> {

    _onClickIncrement = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        this.props.increment(1)
    }

    _onClickSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!this.props.isSaving) {
            this.props.save(this.props.counter.value)
        }
    }

    _onClickLoad = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!this.props.isLoading) {
            this.props.load()
        }
    }

    render() {
        const { counter, label, isSaving, isLoading, error } = this.props
        return <form>
            <legend>{label}</legend>
            <pre>{JSON.stringify({ counter, isSaving, isLoading }, null, 2)}</pre>
            <button ref='increment' onClick={this._onClickIncrement}>click me!</button>
            <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
            <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{isLoading ? 'loading...' : 'load'}</button>
            {error ? <div className='error'>{error}</div> : null}
        </form>
    }
}


