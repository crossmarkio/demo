import {myClass, obj, add} from '../src/index'

describe('testing class', () => {
    test('printWidth', () => {
        const x = new myClass(100, 500)
      expect(x.printWidth(100)).toBe(100);
    });

    test('printHeight', () => {
      const x = new myClass(100, 500)
      expect(x.printHeight("200")).toBe("200");
  });
});

describe('testing obj', () => {
    test('The valueOne should equal test', () => {
      expect(obj.valueOne).toBe("test")
    });
  });

  describe('testing add', () => {
    test('add', () => {
        const result = add('1, 2, 4, 5');
        expect(result).toBe(12);
    });

});


