import { Request, Headers } from 'node-fetch';

export const createFetchRequest: Request = (req: any) => {
    const origin = `${req.protocol}://${req.get('host')}`;

    const url = new URL(req.originalUrl || req.url, origin);

    const controller = new AbortController();
    req.on('close', () => controller.abort());

    const headers = new Headers();

    for (const [key, values] of Object.entries(req.headers)) {
        if (values) {
            if (Array.isArray(values)) {
                for (const value of values) {
                    headers.append(key as keyof Headers, value);
                }
            } else {
                headers.set(key as keyof Headers, values);
            }
        }
    }

    // Use the Partial type to make all properties optional
    const init: Partial<RequestInit> = {
        method: req.method,
        headers,
        signal: controller.signal,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = req.body;
    }

    return new Request(url.href, init);
};
