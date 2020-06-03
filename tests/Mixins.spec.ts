import { applyMixins } from '../src/common/Mixins';

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

test("methods from mixins should be available in target objects", () => {
    class Duck {}
    interface Duck extends Flying, Swimming {}
    applyMixins(Duck, [Flying, Swimming]);

    let duck = new Duck();

    expect(duck).toHaveProperty('fly')
    expect(duck.fly).toBeInstanceOf(Function)
    expect(duck.fly()).toBe('flying!')

    expect(duck).toHaveProperty('swim')
    expect(duck.swim).toBeInstanceOf(Function)
    expect(duck.swim()).toBe('swimming!')
})

test("methods from mixins override methods from classes", () => {
    class Whale {
        public swim() {
            return "always swimming!"
        }
    }
    interface Whale extends Swimming {}
    applyMixins(Whale, [Swimming]);

    let whale = new Whale();
    expect(whale.swim()).toBe('swimming!');
})