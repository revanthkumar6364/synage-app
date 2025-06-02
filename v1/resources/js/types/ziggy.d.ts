declare module 'ziggy-js' {
    interface Config {
        url: string;
        port: number | null;
        defaults: Record<string, unknown>;
        routes: Record<string, {
            uri: string;
            methods: string[];
            domain?: string | null;
            bindings?: Record<string, string>;
            parameters?: string[];
            middleware?: string[];
        }>;
    }

    interface Options {
        absolute?: boolean;
        [key: string]: unknown;
    }

    function route(name?: string, params?: Record<string, unknown> | unknown[], absolute?: boolean): string;
    function route(name?: string, params?: Record<string, unknown> | unknown[], absolute?: boolean, config?: Config): string;

    export = route;
}
