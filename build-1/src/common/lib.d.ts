export declare function cloneObject(data: any, defaultValue?: {}): any;
export declare function exclude<O, Key extends keyof O>(obj: O, keys: Key[]): Omit<O, Key>;
