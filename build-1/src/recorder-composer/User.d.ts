export default class User {
    id: string;
    readonly name: string;
    readonly avatar?: string;
    constructor(id: string, name: string, avatar?: string);
}
