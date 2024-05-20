
export interface IOptions {
    requireAuth: boolean;
    hasLoader: boolean; 
    hasAction: boolean; 
    hasClientLoader: boolean;  
    hasComponent: boolean;
    hasErrorBoundary: boolean;
    hasLinks: boolean; 
    hasMeta: boolean;
    hasHydrateFallback: boolean; 
    hasShouldRevalidate: boolean; 
    hasHandle: boolean; 
    hasHeaders: boolean; 
    hasClientAction: boolean; 
    loaderDeferKeys: string[]; 
    suffix: string,
    middlewares: any[],
    authority: any[], 
    extraProps: any,
}