export class DbConfig {

    public constructor(init?: Partial<DbConfig>) {
        Object.assign(this, init);
    }

    public dbType: string;

    public dbName: string;

    public userName: string;

    public password: string;

    public maxConnection: number;
}