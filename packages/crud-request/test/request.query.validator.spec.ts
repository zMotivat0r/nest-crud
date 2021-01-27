import { RequestQueryException } from '@nestjsx/crud-request';
import { validateComparisonOperator, validateUUID } from '../src/request-query.validator';

describe('#request-query', () => {
  describe('#validator', () => {
    describe('#validateUUID', () => {
      const uuid = 'cf0917fc-af7d-11e9-a2a3-2a2ae2dbcce4';
      const uuidV4 = '6650aad9-29bd-4601-b9b1-543a7a2d2d54';
      const invalid = 'invalid-uuid';

      it('should throw an error', () => {
        expect(validateUUID.bind(validateUUID, invalid)).toThrow();
      });
      it('should pass, 1', () => {
        expect(validateUUID(uuid, '')).toBeUndefined();
      });
      it('should pass, 2', () => {
        expect(validateUUID(uuidV4, '')).toBeUndefined();
      });
    });

    describe('#validateComparisonOperator', () => {
      it('should pass with common validator', () => {
        const withCustom = validateComparisonOperator('gt', {});
        const withoutCustom = validateComparisonOperator('gt');
        expect(withCustom).toBeUndefined();
        expect(withoutCustom).toBeUndefined();
      });
      it('should pass with defined custom validator', () => {
        const withCustom = validateComparisonOperator('definedCustom', {
          definedCustom: {},
        });
        expect(withCustom).toBeUndefined();
      });
      it('should not pass with undefined custom validator', () => {
        expect(validateComparisonOperator.bind(this, 'undefinedCustom')).toThrowError(
          RequestQueryException,
        );
      });
    });
  });
});
