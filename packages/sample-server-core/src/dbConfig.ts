import { Config } from 'knex';

export class DbConfig {
    constructor(private config: Config) {

    }
    public getConfiguration(): Config { return this.config; }
}
