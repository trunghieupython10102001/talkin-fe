export declare function getNumberFromString(str: string): number;
export declare const sleep: (milisecondsTime: number) => Promise<void>;
export declare const hashPasswordString: (password: any) => Promise<string>;
export declare const comparePassword: (plainPassword: any, hashPassword: any) => Promise<boolean>;
export declare const getFormattedDate: (date: Date) => string;
export declare const getFormattedHourAndMinute: (date: Date) => string;
