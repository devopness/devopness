// https://www.typescriptlang.org/docs/handbook/mixins.html
/* eslint-disable */
export function applyMixins(target: any, mixins: any[]): any {
    // check if target and mixins have the same base class
    const targetSuper = Object.getPrototypeOf(target);
    mixins.forEach(mixin => {
        if (targetSuper !== Object.getPrototypeOf(mixin)) {
            throw `can't apply mixin: '${target.name}' and '${mixin.name}' must have the same superclass`;
        }
    })
    // patch target
    mixins.forEach(mixin => {
        Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(mixin.prototype, name);
            if (descriptor) {
                Object.defineProperty(target.prototype, name, descriptor);
            } else {
                throw `can't apply mixin: undefined property descriptor '${name}' in '${mixin.name}'`;
            }
        });
    });
}
