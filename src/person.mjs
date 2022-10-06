export default class person {
    constructor(name = 'noname', age = 0) {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        const { name, age } = this;
        return { name, age, gender: 'male' };
    }
    toString() {
        return JSON.stringify(this);
    }
}

export const a = 10;
const f = n => n * n;

export { f };
