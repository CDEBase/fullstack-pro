export namespace Store {
    export type Counter = { value: number };

    export type Sample = {
        '@sample-stack/counter': Counter;
        '@sample-stack/isSaving': boolean;
        '@sample-stack/isLoading': boolean;
        '@sample-stack/error': string;
    };
}
