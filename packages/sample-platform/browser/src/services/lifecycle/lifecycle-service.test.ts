import 'reflect-metadata';
import { logger } from '@cdm-logger/server';
import { LifecycleService } from './lifecycle-service';
import 'jest';
import { BeforeShutdownEvent, ShutdownReason, LifecyclePhase } from '@workbench-stack/core';


class BeforeShutdownEventImpl implements BeforeShutdownEvent {

    public value: boolean | Promise<boolean> | undefined;
    public reason = ShutdownReason.CLOSE;

    public veto(value: boolean | Promise<boolean>): void {
        this.value = value;
    }
}

describe('LifeService', () => {

    it('onWillShutdown', async function() {
        const lifecycleService = new LifecycleService(logger);

        const event = new BeforeShutdownEventImpl();
        lifecycleService.fireWillShutdown(event);

        const veto = event.value;
        if (typeof veto === 'boolean') {
            console.log(!veto);
        } else {
            console.log(!(await veto));
        }

        lifecycleService.when(LifecyclePhase.Starting).then(() => {
            console.log('LIFECYCLE STARTING');
        });
        lifecycleService.when(LifecyclePhase.Ready).then(() => {
            console.log('LIFECYCLE READY', lifecycleService.phase);
        });
        console.log('i came first');
        lifecycleService.phase = LifecyclePhase.Ready;

    });
});
