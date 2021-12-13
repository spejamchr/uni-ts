export const Positive = '+';
export const Negative = '-';
export const Digit = '1';

export const Zero = Positive;
export const One = `${Positive}${Digit}` as const;

export type Positive = typeof Positive;
export type Negative = typeof Negative;
export type Sign = Positive | Negative;
export type Digit = typeof Digit;
export type Num = `${Sign}${string}`;
export type Zero = Positive;
export type One = typeof One;

export const toNumber = <A extends Num>(a: A): number =>
  ((a[0] === Positive ? 1 : -1) * a.slice(1).length) / Digit.length;

export const toIntType = <A extends Num>(n: number): A =>
  (n >= 0 ? `${Positive}${Digit.repeat(n)}` : `${Negative}${Digit.repeat(-n)}`) as A;

export type Negate<A extends Num> = A extends Zero
  ? A
  : A extends `${Positive}${infer T}`
  ? `${Negative}${T}`
  : A extends `${Negative}${infer T}`
  ? `${Positive}${T}`
  : never;

export const negate = <A extends Num>(a: A): Negate<A> => toIntType(-toNumber(a));

export type Add<A extends Num, B extends Num> = A extends `${infer SA}${infer TA}`
  ? B extends `${infer SB}${infer TB}`
    ? SA extends Sign
      ? SA extends SB
        ? `${SB}${TA}${TB}`
        : Subtract<A, `${SA}${TB}`>
      : never
    : never
  : never;

export const add = <A extends Num, B extends Num>(a: A, b: B): Add<A, B> =>
  toIntType(toNumber(a) + toNumber(b));

export type Subtract<A extends Num, B extends Num> = B extends `${infer SB}${infer TB}`
  ? A extends `${infer SA}${infer TA}`
    ? SA extends Sign
      ? SB extends Sign
        ? SA extends SB
          ? TA extends `${TB}${infer RA}`
            ? `${SB}${RA}`
            : TB extends `${TA}${infer RB}`
            ? Negate<`${SB}${RB}`>
            : never
          : Add<A, Negate<B>>
        : never
      : never
    : never
  : never;

export const subtract = <A extends Num, B extends Num>(a: A, b: B): Subtract<A, B> =>
  toIntType(toNumber(a) - toNumber(b));
