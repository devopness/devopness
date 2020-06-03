/* 
Copies all methods from `siblings` into `target`, enforcing that they share the same superclass.
This ensures that references to super methods inside of the resulting merged target are available.
Modified from the `applyMixins` method described in https://www.typescriptlang.org/docs/handbook/mixins.html
*/
/* eslint-disable */
export function mergeSiblingClasses(target: any, siblings: any[]): any {
    // check if siblings and target share same superclass
    const targetSuper = Object.getPrototypeOf(target);
    siblings.forEach(sibling => {
        if (targetSuper !== Object.getPrototypeOf(sibling)) {
            throw `can't merge siblings: '${target.name}' and '${sibling.name}' must have the same superclass`;
        }
    })
    // patch target
    siblings.forEach(sibling => {
        Object.getOwnPropertyNames(sibling.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(sibling.prototype, name);
            if (descriptor) {
                Object.defineProperty(target.prototype, name, descriptor);
            } else {
                throw `can't merge siblings: undefined property descriptor '${name}' in '${sibling.name}'`;
            }
        });
    });
}
