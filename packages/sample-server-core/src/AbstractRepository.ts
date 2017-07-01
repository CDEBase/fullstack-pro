import { inject, injectable } from 'inversify';
import * as Knex from 'knex';
import { DbConfig } from './dbConfig';

let _db: Knex;

/**
 * Returns an instance of database
 */
const getDb = (config: DbConfig): Knex => {

    if (!_db) {
        _db = Knex(config.getConfiguration())
    }

    return _db;
};

@injectable()
export abstract class AbstractRepository {

    @inject('DefaultDbConfig')
    public dbConfig: DbConfig;

    abstract tableName: string;

    /**
     * Returns an instance of database
     */
    getDb(): Knex {
        return getDb(this.dbConfig);
    }

    /**
     * Returns a IQueryBuilder instance of Table
     */
    getTable(): Knex.QueryBuilder {
        return this.getDb().table(this.tableName);
    }
}
