import { DevopnessApiClient } from '../src/DevopnessApiClient';

const api = new DevopnessApiClient();

test('convertToHostname() util method', () => {
    const list = [
        ['Maria da Conceição', 'maria-da-conceicao'],
        ['-2+5=7? não véi, cê é doido? e o signed two?', '2-5-7-nao-vei-ce-e-doido-e-o-signed-two'],
        [' Espaço no início melhor ignorar---varioshifens_tb', 'espaco-no-inicio-melhor-ignorar-varioshifens-tb'],
        ['-- test --', 'test'],
        ['long     space', 'long-space'],
        ['\u00F1', 'n'],
        ['\u006E\u0303', 'n'],
    ];

    for (let [input, expectedOutput] of list) {
        const output = api.servers.convertToHostname(input);
        expect(output).toBe(expectedOutput);
    }
});
