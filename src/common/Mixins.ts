// https://www.typescriptlang.org/docs/handbook/mixins.html
export function applyMixins(derivedCtor: any, baseCtors: any[]): any {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (descriptor) {
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            } else {
                throw `undefined property descriptor '${name}' in '${typeof baseCtor}'`;
            }
        });
    });
}