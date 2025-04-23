import {Greeter} from './greeter';

describe('Greeter', () =>{
    it('should greet a person by name', ()=>{
        const greeter = new Greeter();
        const result = greeter.greet("Nition");
        expect(result).toBe("Hello, Nition!");
    });
});