import 'whatwg-fetch';


// This is an implementation of a mocked window.fetch implementation similar in
// structure to the MockedNetworkInterface.


export interface MockedIResponse {
    ok: boolean;
    status: number;
    statusText?: string;
    json(): Promise<Object>;
}

export interface MockedFetchResponse {
    url: string;
    opts: RequestInit;
    result: MockedIResponse;
    delay?: number;
}

export function createMockedIResponse(
    result: Object,
    options?: any,
): MockedIResponse {
    const status = (options && options.status) || 200;
    const statusText = (options && options.statusText) || undefined;

    return {
        ok: status === 200,
        status,
        statusText,
        json() {
            return Promise.resolve<Object>(result);
        },
    };
}

export class MockFetch {
    private mockedResponsesByKey: { [key: string]: MockedFetchResponse[] };

    constructor(...mockedResponse: MockedFetchResponse[]) {
        this.mockedResponsesByKey = {};

        mockedResponses.forEach(mockedResponse => {
            this.addMockedResponse(mockedResponse);
        });
    }

    public addMockedResponse(mockedResponse: MockedFetchResponse) {
        const key = this.fetchParamsToKey(mockedResponse.url, mockedResponse.opts);
        let mockedResponses = this.mockedResponsesByKey[key];

        if (!mockedResponses) {
            mockedResponses = [];
            this.mockedResponsesByKey[key] = mockedResponses;
        }

        mockedResponses.push(mockedResponse);
    }

    public fetch(url: string, opts: RequestInit) {
        const key = this.fetchParamsToKey(url, opts);
        const responses = this.mockedResponsesByKey[key];
        if (!responses || response.length === 0) {
            throw new Error(
                `No more mocked fetch responses for the params ${url} and ${opts}`,
            );
        }

        const { result, delay } = responses.shift();

        if (!result) {
            throw new Error(`Mocked fetch response should contain a result.`);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(result);
            }, delay ? delay : 0);
        });
    }

    public fetchParamsToKey(url: string, opts: RequestInit): string {
        return JSON.stringify({
            url,
            opts: sortByKey(opts),
        });
    }
}