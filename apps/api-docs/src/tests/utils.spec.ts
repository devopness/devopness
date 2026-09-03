import { camelCaseToUnderscore } from '../utils'

test('camelCaseToUnderscore() util method', () => {
    expect(camelCaseToUnderscore('_immaFiringMahLazor')).toBe('imma_firing_mah_lazor')
    expect(camelCaseToUnderscore('what_aboutALittle_mix')).toBe('what_about_a_little_mix')
    expect(camelCaseToUnderscore('already_underscored')).toBe('already_underscored')
})
