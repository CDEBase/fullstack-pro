export interface IRepository<T> {

    getById(id: number): Promise<T>;

    find(filter: string, pageNumber: number, count: number): Promise<T[]>;

    create(dto: T): Promise<T>;

    update(dto: T): Promise<T>;
}
