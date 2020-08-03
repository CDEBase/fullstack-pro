
import { ILifecycleService, LifecyclePhase, WillShutdownEvent, StartupKind, BeforeShutdownEvent, ShutdownReason } from '@workbench-stack/core';
import { Event, Emitter } from '@vscode/monaco-editor/esm/vs/base/common/event';
import { Barrier } from '@vscode/monaco-editor/esm/vs/base/common/async';
import { injectable, inject } from 'inversify';
import { ClientTypes as CommonTypes } from '@common-stack/client-core';

@injectable()
export class LifecycleService implements ILifecycleService {

    public startupKind: StartupKind;

    private _phase: LifecyclePhase = LifecyclePhase.Starting;

    private phaseWhen = new Map<LifecyclePhase, Barrier>();


    private _onBeforeShutdown = new Emitter<BeforeShutdownEvent>();
    private _onWillShutdown = new Emitter<WillShutdownEvent>();
    private _onShutdown = new Emitter<void>();

    constructor(
        @inject(CommonTypes.Logger)
        protected logService: any,
    ) {}

    get phase(): LifecyclePhase {
        return this._phase;
    }

    set phase(value: LifecyclePhase) {
        if (value < this.phase) {
            throw new Error('Lifecycle cannot go backwards');
        }

        if (this._phase === value) {
            return;
        }

        this.logService.trace(`lifecycle: phase changed (value: ${value})`);

        this._phase = value;
        // mark(`LifecyclePhase/${LifecyclePhaseToString(value)}`);

        const barrier = this.phaseWhen.get(this._phase);
        if (barrier) {
            barrier.open();
            this.phaseWhen.delete(this._phase);
        }
    }

    public fireShutdown(reason = ShutdownReason.QUIT): void {
        this._onWillShutdown.fire({
            join: () => { },
            reason,
        });
    }

    public fireWillShutdown(event: BeforeShutdownEvent): void {
        this._onBeforeShutdown.fire(event);
    }

    public get onBeforeShutdown(): Event<BeforeShutdownEvent> {
        return this._onBeforeShutdown.event;
    }

    public get onWillShutdown(): Event<WillShutdownEvent> {
        return this._onWillShutdown.event;
    }

    public get onShutdown(): Event<void> {
        return this._onShutdown.event;
    }

    public async when(phase: LifecyclePhase): Promise<void> {
        if (phase <= this._phase) {
            return;
        }

        let barrier = this.phaseWhen.get(phase);
        if (!barrier) {
            barrier = new Barrier();
            this.phaseWhen.set(phase, barrier);
        }

        await barrier.wait();
    }

}
