import { baseUnitForQuantity, Measurement, measurement } from '.';
import { add, negate, One } from '../IntegerType';
import { Quantity } from '../Quantity';

const Two = add(One, One);
const Three = add(Two, One);

const testMeasurement =
  <A extends Quantity>(m: Measurement<A>) =>
  (symbol: string, magnitude: number, baseRatio: number, quantity: Quantity): void => {
    expect(m.symbol).toBe(symbol);
    expect(m.magnitude).toBe(magnitude);
    expect(m.baseRatio).toBe(baseRatio);
    expect(m.quantity).toStrictEqual(quantity);
  };

test('can create measurement', () => {
  const t = testMeasurement(measurement('a', 2, 1, {}));

  t('a', 2, 1, {});
});

test('baseUnitForQuantity works', () => {
  const a = baseUnitForQuantity('quantityA', 'a');
  const t = testMeasurement(a(8));

  t('a', 8, 1, { quantityA: One });
});

const unitA = baseUnitForQuantity('quantityA', 'a');
const unitB = baseUnitForQuantity('quantityB', 'b');
const derived = unitA(50).named('derived');

test('measurement.plus works', () => {
  const t = testMeasurement(unitA(2).plus(unitA(3)));

  t('a', 5, 1, { quantityA: One });
});

test('plus with derived works', () => {
  const t = testMeasurement(unitA(50).plus(derived(1)));

  t('derived', 2, 50, { quantityA: One });
});

test('measurement.minus works', () => {
  const t = testMeasurement(unitA(2).minus(unitA(3)));

  t('a', -1, 1, { quantityA: One });
});

test('minus with derived works', () => {
  const t = testMeasurement(unitA(100).minus(derived(1)));

  t('derived', 1, 50, { quantityA: One });
});

test('measurement.times works', () => {
  const t = testMeasurement(unitA(2).times(unitB(3)));

  t('a b', 6, 1, { quantityA: One, quantityB: One });
});

test('times with derived works', () => {
  const t = testMeasurement(unitA(2).times(derived(3)));

  t('a derived', 6, 50, { quantityA: Two });
});

test('measurement.per works', () => {
  const t = testMeasurement(unitA(6).per(unitB(3)));

  t('a (b)**-1', 2, 1, { quantityA: One, quantityB: negate(One) });
});

test('per with derived works', () => {
  const t = testMeasurement(unitA(6).per(derived(2)));

  t('a (derived)**-1', 3, 1 / 50, {});
});

test('measurement.into works', () => {
  const t = testMeasurement(unitA(3).into(unitA));

  t('a', 3, 1, { quantityA: One });
});

test('into derived works', () => {
  const t = testMeasurement(derived(3).into(unitA));

  t('a', 150, 1, { quantityA: One });
});

test('measurement.inverted works', () => {
  const t = testMeasurement(unitA(3).inverted());

  t('(a)**-1', 1 / 3, 1, { quantityA: negate(One) });
});

test('inverted on derived works', () => {
  const t = testMeasurement(derived(3).inverted());

  t('(derived)**-1', 1 / 3, 1 / 50, { quantityA: negate(One) });
});

test('measurement.squared works', () => {
  const t = testMeasurement(unitA(3).squared());

  t('(a)**2', 9, 1, { quantityA: Two });
});

test('squared on derived works', () => {
  const t = testMeasurement(derived(3).squared());

  t('(derived)**2', 9, 50 ** 2, { quantityA: Two });
});

test('measurement.cubed works', () => {
  const t = testMeasurement(unitA(3).cubed());

  t('(a)**3', 27, 1, { quantityA: Three });
});

test('cubed on derived works', () => {
  const t = testMeasurement(derived(3).cubed());

  t('(derived)**3', 27, 50 ** 3, { quantityA: Three });
});

test('measurement.named works', () => {
  const t = testMeasurement(unitA(4).named('sym')(3));

  t('sym', 3, 4, { quantityA: One });
});

test('named on derived works', () => {
  const t = testMeasurement(derived(3).named('three')(2));

  t('three', 2, 150, { quantityA: One });
});

test('measurement.prefixed works', () => {
  const t = testMeasurement(unitA(4).prefixed('pre:')(3));

  t('pre:a', 3, 4, { quantityA: One });
});

test('prefixed on derived works', () => {
  const t = testMeasurement(derived(1 / 25).prefixed('h-')(3));

  t('h-derived', 3, 2, { quantityA: One });
});
