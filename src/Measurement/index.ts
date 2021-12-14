import {
  Add as AddQua,
  add as addQua,
  Mul2,
  Mul3,
  Negate,
  negate,
  OneQuantity,
  oneQuantity,
  Quantity,
  Subtract as SubtractQua,
  subtract as subtractQua,
} from '../Quantity';

export class Measurement<A extends Quantity> {
  constructor(
    public symbol: string,
    public magnitude: number,
    public baseRatio: number,
    public quantity: A
  ) {}

  plus: EquivalentMeasurements<A> = (b) =>
    measurement(
      b.symbol,
      (this.magnitude * this.baseRatio) / b.baseRatio + b.magnitude,
      b.baseRatio,
      this.quantity
    );

  minus: EquivalentMeasurements<A> = (b) =>
    measurement(
      b.symbol,
      (this.magnitude * this.baseRatio) / b.baseRatio - b.magnitude,
      b.baseRatio,
      this.quantity
    );

  times: MultiplyMeasurements<A> = (b) =>
    measurement(
      `${this.symbol} ${b.symbol}`,
      this.magnitude * b.magnitude,
      this.baseRatio * b.baseRatio,
      addQua(this.quantity, b.quantity)
    );

  per: DivideMeasurements<A> = (b) =>
    measurement(
      `${this.symbol} (${b.symbol})**-1`,
      this.magnitude / b.magnitude,
      this.baseRatio / b.baseRatio,
      subtractQua(this.quantity, b.quantity)
    );

  into: ConvertMeasurement<A> = (fn) => {
    const one = fn(1);
    return measurement(
      one.symbol,
      (this.magnitude * this.baseRatio) / one.baseRatio,
      one.baseRatio,
      one.quantity
    );
  };

  inverted = (): Measurement<Negate<A>> =>
    measurement(
      `(${this.symbol})**-1`,
      1 / this.magnitude,
      1 / this.baseRatio,
      negate(this.quantity)
    );

  squared = (): Measurement<Mul2<A>> =>
    measurement(
      `(${this.symbol})**2`,
      this.magnitude ** 2,
      this.baseRatio ** 2,
      addQua(this.quantity, this.quantity)
    );

  cubed = (): Measurement<Mul3<A>> =>
    measurement(
      `(${this.symbol})**3`,
      this.magnitude ** 3,
      this.baseRatio ** 3,
      addQua(addQua(this.quantity, this.quantity), this.quantity)
    );

  named: NewSymboled<A> = <B extends A>(newSymbol: A extends B ? string : never): Measure<B> =>
    measure(newSymbol, this.magnitude * this.baseRatio, this.quantity as B);

  prefixed: NewSymboled<A> = <B extends A>(prefix: A extends B ? string : never): Measure<B> =>
    measure(`${prefix}${this.symbol}`, this.magnitude * this.baseRatio, this.quantity as B);
}

export type Measure<Q extends Quantity> = (magnitude: number) => Measurement<Q>;

type EquivalentMeasurements<A extends Quantity> = <B extends A>(
  b: A extends B ? Measurement<B> : never
) => Measurement<A>;

type MultiplyMeasurements<A extends Quantity> = <B extends Quantity>(
  b: Measurement<B>
) => Measurement<AddQua<A, B>>;

type DivideMeasurements<A extends Quantity> = <B extends Quantity>(
  b: Measurement<B>
) => Measurement<SubtractQua<A, B>>;

type ConvertMeasurement<A extends Quantity> = <B extends A>(
  fn: A extends B ? Measure<B> : never
) => Measurement<B>;

type NewSymboled<A extends Quantity> = <B extends A>(
  symbol: A extends B ? string : never
) => Measure<B>;

export const measurement = <A extends Quantity>(
  symbol: string,
  magnitude: number,
  baseRatio: number,
  quantity: A
): Measurement<A> => new Measurement(symbol, magnitude, baseRatio, quantity);

export const measure =
  <A extends Quantity>(symbol: string, baseRatio: number, quantity: A): Measure<A> =>
  (magnitude) =>
    measurement(symbol, magnitude, baseRatio, quantity);

export const baseUnitForQuantity = <K extends keyof Quantity>(
  key: K,
  symbol: string
): Measure<OneQuantity<K>> => measure(symbol, 1, oneQuantity(key));
