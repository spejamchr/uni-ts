import {
  add,
  Digit,
  negate,
  Negative,
  One,
  Positive,
  subtract,
  toIntType,
  toNumber,
  Zero,
} from '.';

test('toNumber works', () => {
  expect(toNumber(Zero)).toBe(0);
  expect(toNumber(One)).toBe(1);
  expect(toNumber(`${Positive}${Digit}${Digit}${Digit}`)).toBe(3);
  expect(toNumber(`${Negative}${Digit}${Digit}${Digit}`)).toBe(-3);
});

test('toIntType works', () => {
  expect(toIntType(0)).toBe(Zero);
  expect(toIntType(1)).toBe(One);
  expect(toIntType(3)).toBe(`${Positive}${Digit}${Digit}${Digit}`);
  expect(toIntType(-3)).toBe(`${Negative}${Digit}${Digit}${Digit}`);
});

test('negating 0 returns 0', () => {
  expect(negate(Zero)).toBe(Zero);
});

test('negating 1 returns -1', () => {
  expect(negate(One)).toBe(`${Negative}${Digit}`);
});

test('negating -1 returns 1', () => {
  expect(negate(`${Negative}${Digit}`)).toBe(One);
});

test('Adding works', () => {
  expect(add(Zero, Zero)).toBe(Zero);
  expect(add(Zero, One)).toBe(One);
  expect(add(One, Zero)).toBe(One);
  expect(add(One, One)).toBe(`${Positive}${Digit}${Digit}`);
  expect(add(negate(One), One)).toBe(Zero);
});

test('Subtracting works', () => {
  expect(subtract(Zero, Zero)).toBe(Zero);
  expect(subtract(Zero, One)).toBe(negate(One));
  expect(subtract(One, Zero)).toBe(One);
  expect(subtract(One, One)).toBe(Zero);
  expect(subtract(negate(One), One)).toBe(`${Negative}${Digit}${Digit}`);
});
