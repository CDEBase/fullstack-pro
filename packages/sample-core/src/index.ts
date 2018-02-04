

export interface PersonType {
    name: string;
    id: string;
    sex: string;
    matches: [PersonType];
}
export interface SomeType {
    testInt: number;
    testFloat: number;
    fixedString: string;
}
export enum TaggedType {
    MICROSERVICE = 'MICROSERVICE',
}
