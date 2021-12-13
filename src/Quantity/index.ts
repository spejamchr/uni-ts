import {
  add as addInt,
  Add as AddInt,
  negate as negInt,
  Negate as NegInt,
  Num,
  One,
  subtract as subtractInt,
  Subtract as SubtractInt,
  Zero
} from '../IntegerType';

export type Quantity = { [k in string]: Num };

export type Negate<Q extends Quantity> = { [K in keyof Q]: NegInt<Q[K]> };
export type N<Q extends Quantity> = Negate<Q>;

export const negate = <Q extends Quantity>(q: Q): N<Q> =>
  Object.keys(q).reduce((acc: N<Q>, k: keyof Q) => {
    acc[k] = negInt(q[k]);
    return acc;
  }, {} as N<Q>);

export type Add<Q1 extends Quantity, Q2 extends Quantity> = {
  [K in keyof Q1 | keyof Q2 as Exclude<
    K,
    K extends keyof Q1
      ? K extends keyof Q2
        ? Q1[K] extends NegInt<Q2[K]>
          ? K
          : never
        : never
      : never
  >]: AddInt<K extends keyof Q1 ? Q1[K] : Zero, K extends keyof Q2 ? Q2[K] : Zero>;
};

export const add = <Q1 extends Quantity, Q2 extends Quantity>(q1: Q1, q2: Q2): Add<Q1, Q2> =>
  Object.keys({ ...q1, ...q2 }).reduce((acc: Quantity, k) => {
    const v1: Num = q1[k] || '+';
    const v2: Num = q2[k] || '+';
    if (v1 === negInt(v2)) return acc;

    acc[k] = addInt(v1, v2);
    return acc;
  }, {}) as Add<Q1, Q2>;

export type Subtract<Q1 extends Quantity, Q2 extends Quantity> = {
  [K in keyof Q1 | keyof Q2 as Exclude<
    K,
    K extends keyof Q1 ? (K extends keyof Q2 ? (Q1[K] extends Q2[K] ? K : never) : never) : never
  >]: SubtractInt<K extends keyof Q1 ? Q1[K] : Zero, K extends keyof Q2 ? Q2[K] : Zero>;
};

export const subtract = <Q1 extends Quantity, Q2 extends Quantity>(
  q1: Q1,
  q2: Q2
): Subtract<Q1, Q2> =>
  Object.keys({ ...q1, ...q2 }).reduce((acc: Quantity, k) => {
    const v1: Num = q1[k] || '+';
    const v2: Num = q2[k] || '+';
    if (v1 === v2) return acc;

    acc[k] = subtractInt(v1, v2);
    return acc;
  }, {}) as Subtract<Q1, Q2>;

export type Mul2<Q extends Quantity> = Add<Q, Q>;

export type Mul3<Q extends Quantity> = Add<Add<Q, Q>, Q>;

export type OneQuantity<K extends keyof Quantity> = { [k in K]: One };

export const oneQuantity = <K extends keyof Quantity>(key: K): OneQuantity<K> =>
  ({ [key]: '+1' } as OneQuantity<K>);
