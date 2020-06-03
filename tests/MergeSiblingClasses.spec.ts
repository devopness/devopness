import { mergeSiblingClasses } from '../src/common/MergeSiblingClasses';

class Flying {
    public fly() {
        return "flying!"
    }
}
class Swimming {
    public swim() {
        return "swimming!"
    }
}

test("methods from all merged classes should be available in target classes", () => {
    class Duck {}
    interface Duck extends Flying, Swimming {}
    mergeSiblingClasses(Duck, [Flying, Swimming]);

    let duck = new Duck();

    expect(duck).toHaveProperty('fly')
    expect(duck.fly).toBeInstanceOf(Function)
    expect(duck.fly()).toBe('flying!')

    expect(duck).toHaveProperty('swim')
    expect(duck.swim).toBeInstanceOf(Function)
    expect(duck.swim()).toBe('swimming!')
})

test("methods from siblings override methods from target class", () => {
    class Whale {
        public swim() {
            return "always swimming!"
        }
    }
    interface Whale extends Swimming {}
    mergeSiblingClasses(Whale, [Swimming]);

    let whale = new Whale();
    expect(whale.swim()).toBe('swimming!');
})

test("merged siblings must have same superclass as target class", () => {
    class Base {}

    class A {}
    class B extends Base {}
    interface A extends B {}
    expect(() => mergeSiblingClasses(A, [B])).toThrow()

    class C extends Base {}
    class D extends Base {}
    interface C extends D {}
    expect(() => mergeSiblingClasses(C, [D])).not.toThrow()
})
