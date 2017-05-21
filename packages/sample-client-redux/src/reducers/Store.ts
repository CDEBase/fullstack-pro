export module Store {
    export type Counter = { value: number }

    export type Sample = {
        "@sample/counter": Counter,
        "@sample/isSaving": boolean,
        "@sample/isLoading": boolean,
        "@sample/error": string,
    }
}