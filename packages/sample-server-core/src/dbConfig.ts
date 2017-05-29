import { Config } from 'knex';

export class DbConfig implements Config {
    constructor(private config: Config) {

    }

    public getConfiguration(): Config { return this.config }

}