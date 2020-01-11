import { assertIsDefined } from '../assertion';

describe('Test custom assertions ', () => {
    it('assertIsDefined should throw for null and undefined ', () => {
        expect(() => assertIsDefined(null)).toThrowError();
        expect(() => assertIsDefined(undefined)).toThrowError();

        expect(() => assertIsDefined({})).not.toThrowError();
    });
});
