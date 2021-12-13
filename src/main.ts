import { add, Add, negate, Negate, Num, One, subtract, Subtract, Zero } from './IntegerType';

export type Quantity = { [k in string]: Num };

interface Measurement<Q extends Quantity> {
  magnitude: number;
  unit: Q;
}

const measurement = <Q extends Quantity>(magnitude: number, unit: Q): Measurement<Q> => ({
  magnitude,
  unit,
});

type SameUnits = <Q1 extends Quantity, Q2 extends Q1>(
  a: Measurement<Q1>,
  b: Q1 extends Q2 ? Measurement<Q2> : never
) => Measurement<Q1>;

export const uAdd: SameUnits = (a, b) => measurement(a.magnitude + b.magnitude, a.unit);

export const uSubtract: SameUnits = (a, b) => measurement(a.magnitude - b.magnitude, a.unit);

type NegQ<Q extends Quantity> = { [K in keyof Q]: Negate<Q[K]> };

const negQ = <Q extends Quantity>(q: Q): NegQ<Q> =>
  Object.keys(q).reduce((acc: NegQ<Q>, k: keyof Q) => {
    acc[k] = negate(q[k]);
    return acc;
  }, {} as NegQ<Q>);

export const uNeg = <Q extends Quantity>({
  magnitude,
  unit,
}: Measurement<Q>): Measurement<NegQ<Q>> => measurement(1 / magnitude, negQ(unit));

type AddQ<Q1 extends Quantity, Q2 extends Quantity> = {
  [K in keyof Q1 | keyof Q2 as Exclude<
    K,
    K extends keyof Q1
      ? K extends keyof Q2
        ? Q1[K] extends Negate<Q2[K]>
          ? K
          : never
        : never
      : never
  >]: Add<K extends keyof Q1 ? Q1[K] : Zero, K extends keyof Q2 ? Q2[K] : Zero>;
};

const addQ = <Q1 extends Quantity, Q2 extends Quantity>(q1: Q1, q2: Q2): AddQ<Q1, Q2> =>
  Object.keys({ ...q1, ...q2 }).reduce((acc: Quantity, k) => {
    const v1: Num = q1[k] || '+';
    const v2: Num = q2[k] || '+';
    if (v1 === negate(v2)) return acc;

    acc[k] = add(v1, v2);
    return acc;
  }, {}) as AddQ<Q1, Q2>;

type SubtractQ<Q1 extends Quantity, Q2 extends Quantity> = {
  [K in keyof Q1 | keyof Q2 as Exclude<
    K,
    K extends keyof Q1 ? (K extends keyof Q2 ? (Q1[K] extends Q2[K] ? K : never) : never) : never
  >]: Subtract<K extends keyof Q1 ? Q1[K] : Zero, K extends keyof Q2 ? Q2[K] : Zero>;
};

const subtractQ = <Q1 extends Quantity, Q2 extends Quantity>(q1: Q1, q2: Q2): SubtractQ<Q1, Q2> =>
  Object.keys({ ...q1, ...q2 }).reduce((acc: Quantity, k) => {
    const v1: Num = q1[k] || '+';
    const v2: Num = q2[k] || '+';
    if (v1 === v2) return acc;

    acc[k] = subtract(v1, v2);
    return acc;
  }, {}) as SubtractQ<Q1, Q2>;

type SquareQ<Q extends Quantity> = AddQ<Q, Q>;

export const uSquare = <Q extends Quantity>({
  magnitude,
  unit,
}: Measurement<Q>): Measurement<SquareQ<Q>> => measurement(magnitude ** 2, addQ(unit, unit));

type CubeQ<Q extends Quantity> = AddQ<AddQ<Q, Q>, Q>;

export const uCube = <Q extends Quantity>({
  magnitude,
  unit,
}: Measurement<Q>): Measurement<CubeQ<Q>> =>
  measurement(magnitude ** 3, addQ(addQ(unit, unit), unit));

export const uMultiply = <Q1 extends Quantity, Q2 extends Quantity>(
  m1: Measurement<Q1>,
  m2: Measurement<Q2>
): Measurement<AddQ<Q1, Q2>> => measurement(m1.magnitude * m2.magnitude, addQ(m1.unit, m2.unit));

export const uDivide = <Q1 extends Quantity, Q2 extends Quantity>(
  m1: Measurement<Q1>,
  m2: Measurement<Q2>
): Measurement<SubtractQ<Q1, Q2>> =>
  measurement(m1.magnitude / m2.magnitude, subtractQ(m1.unit, m2.unit));

type ToUnit<Q extends Quantity> = (magnitude: number) => Measurement<Q>;

export const convertTo =
  <Q1 extends Quantity>(measurement: Measurement<Q1>) =>
  (basis: ToUnit<Q1>): number =>
    measurement.magnitude / basis(1).magnitude;

type SingularQuantity<K extends keyof Quantity> = { [k in K]: One };

const singularQuantity = <K extends keyof Quantity>(key: K): SingularQuantity<K> =>
  ({ [key]: '+1' } as SingularQuantity<K>);

// Quantity Types

export type Time = SingularQuantity<'time'>;
export type Length = SingularQuantity<'length'>;
export type Mass = SingularQuantity<'mass'>;
export type ElectricCurrent = SingularQuantity<'electricCurrent'>;
export type ThermodynamicTemperature = SingularQuantity<'thermodynamicTemperature'>;
export type AmountOfSubstance = SingularQuantity<'amountOfSubstance'>;
export type LuminousIntensity = SingularQuantity<'luminousIntensity'>;
export type PlanarAngle = SingularQuantity<'planarAngle'>;
export type SolidAngle = SingularQuantity<'solidAngle'>;

export type Frequency = NegQ<Time>;
export type Force = Mass & Length & NegQ<SquareQ<Time>>;
export type Pressure = Mass & NegQ<Length> & NegQ<SquareQ<Time>>;
export type Energy = Mass & SquareQ<Length> & NegQ<SquareQ<Time>>;
export type Power = Mass & SquareQ<Length> & NegQ<CubeQ<Time>>;
export type ElectricCharge = Time & ElectricCurrent;
export type ElectricPotential = Mass & SquareQ<Length> & NegQ<CubeQ<Time>> & NegQ<ElectricCurrent>;
export type Capacitance = NegQ<Mass> &
  NegQ<SquareQ<Length>> &
  SquareQ<SquareQ<Time>> &
  SquareQ<ElectricCurrent>;
export type Resistance = Mass &
  SquareQ<Length> &
  NegQ<CubeQ<Time>> &
  NegQ<SquareQ<ElectricCurrent>>;
export type ElectricalConductance = NegQ<Mass> &
  NegQ<SquareQ<Length>> &
  CubeQ<Time> &
  SquareQ<ElectricCurrent>;
export type MagneticFlux = Mass & SquareQ<Length> & NegQ<SquareQ<Time>> & NegQ<ElectricCurrent>;
export type MagneticFluxDensity = Mass & NegQ<SquareQ<Time>> & NegQ<ElectricCurrent>;
export type Inductance = Mass &
  SquareQ<Length> &
  NegQ<SquareQ<Time>> &
  NegQ<SquareQ<ElectricCurrent>>;
export type LuminousFlux = LuminousIntensity & SolidAngle;
export type Illuminance = LuminousIntensity & SolidAngle & NegQ<SquareQ<Length>>;
export type Radioactivity = Frequency;
export type AbsorbedDose = SquareQ<Length> & NegQ<SquareQ<Time>>;
export type EquivalentDose = AbsorbedDose;
export type CatalyticActivity = AmountOfSubstance & NegQ<Time>;
export type Area = SquareQ<Length>;

// SI Base Units

const baseUnitForQuantity =
  <K extends keyof Quantity>(key: K): ToUnit<SingularQuantity<K>> =>
  (magnitude) =>
    measurement(magnitude, singularQuantity(key));

export const second: ToUnit<Time> = baseUnitForQuantity('time');
export const meter: ToUnit<Length> = baseUnitForQuantity('length');
export const kilogram: ToUnit<Mass> = baseUnitForQuantity('mass');
export const ampere: ToUnit<ElectricCurrent> = baseUnitForQuantity('electricCurrent');
export const kelvin: ToUnit<ThermodynamicTemperature> = baseUnitForQuantity(
  'thermodynamicTemperature'
);
export const mole: ToUnit<AmountOfSubstance> = baseUnitForQuantity('amountOfSubstance');
export const candela: ToUnit<LuminousIntensity> = baseUnitForQuantity('luminousIntensity');

// SI Derived Units

const derivedUnit =
  <Q extends Quantity>(base: Measurement<Q>): ToUnit<Q> =>
  (magnitude) => ({
    magnitude: magnitude * base.magnitude,
    unit: base.unit,
  });

export const gram = derivedUnit<Mass>(kilogram(0.001));
export const radian: ToUnit<PlanarAngle> = baseUnitForQuantity('planarAngle');
export const steradian: ToUnit<SolidAngle> = baseUnitForQuantity('solidAngle');
export const hertz = derivedUnit<Frequency>(uNeg(second(1)));
export const newton = derivedUnit<Force>(
  uDivide(uMultiply(kilogram(1), meter(1)), uSquare(second(1)))
);
export const pascal = derivedUnit<Pressure>(uDivide(newton(1), uSquare(meter(1))));
export const joule = derivedUnit<Energy>(uMultiply(newton(1), meter(1)));
export const watt = derivedUnit<Power>(uDivide(joule(1), second(1)));
export const coulomb = derivedUnit<ElectricCharge>(uMultiply(second(1), ampere(1)));
export const volt = derivedUnit<ElectricPotential>(uDivide(watt(1), ampere(1)));
export const farad = derivedUnit<Capacitance>(uDivide(coulomb(1), volt(1)));
export const ohm = derivedUnit<Resistance>(uDivide(volt(1), ampere(1)));
export const siemens = derivedUnit<ElectricalConductance>(uNeg(ohm(1)));
export const weber = derivedUnit<MagneticFlux>(uMultiply(volt(1), second(1)));
export const tesla = derivedUnit<MagneticFluxDensity>(uDivide(weber(1), uSquare(meter(1))));
export const henry = derivedUnit<Inductance>(uDivide(weber(1), ampere(1)));
export const degreeCelcius: ToUnit<ThermodynamicTemperature> = (magnitude: number) =>
  kelvin(magnitude + 273.15);
export const lumen = derivedUnit<LuminousFlux>(uMultiply(candela(1), steradian(1)));
export const lux = derivedUnit<Illuminance>(uDivide(lumen(1), uSquare(meter(1))));
export const becquerel: ToUnit<Radioactivity> = hertz;
export const gray = derivedUnit<AbsorbedDose>(uDivide(joule(1), kilogram(1)));
export const sievert: ToUnit<EquivalentDose> = gray;
export const katal = derivedUnit<CatalyticActivity>(uDivide(mole(1), second(1)));

// Prefixes for all SI Units

const makePrefix = (exponent: number) => ({
  second: derivedUnit(second(10 ** exponent)),
  meter: derivedUnit(meter(10 ** exponent)),
  gram: derivedUnit(gram(10 ** exponent)),
  ampere: derivedUnit(ampere(10 ** exponent)),
  kelvin: derivedUnit(kelvin(10 ** exponent)),
  mole: derivedUnit(mole(10 ** exponent)),
  candela: derivedUnit(candela(10 ** exponent)),
  radian: derivedUnit(radian(10 ** exponent)),
  steradian: derivedUnit(steradian(10 ** exponent)),
  hertz: derivedUnit(hertz(10 ** exponent)),
  newton: derivedUnit(newton(10 ** exponent)),
  pascal: derivedUnit(pascal(10 ** exponent)),
  joule: derivedUnit(joule(10 ** exponent)),
  watt: derivedUnit(watt(10 ** exponent)),
  coulomb: derivedUnit(coulomb(10 ** exponent)),
  volt: derivedUnit(volt(10 ** exponent)),
  farad: derivedUnit(farad(10 ** exponent)),
  ohm: derivedUnit(ohm(10 ** exponent)),
  siemens: derivedUnit(siemens(10 ** exponent)),
  weber: derivedUnit(weber(10 ** exponent)),
  tesla: derivedUnit(tesla(10 ** exponent)),
  henry: derivedUnit(henry(10 ** exponent)),
  lumen: derivedUnit(lumen(10 ** exponent)),
  lux: derivedUnit(lux(10 ** exponent)),
  becquerel: derivedUnit(becquerel(10 ** exponent)),
  gray: derivedUnit(gray(10 ** exponent)),
  sievert: derivedUnit(sievert(10 ** exponent)),
  katal: derivedUnit(katal(10 ** exponent)),
});

export const yotta = makePrefix(24);
export const zetta = makePrefix(21);
export const exa = makePrefix(18);
export const peta = makePrefix(15);
export const tera = makePrefix(12);
export const giga = makePrefix(9);
export const mega = makePrefix(6);
export const kilo = makePrefix(3);
export const hecto = makePrefix(2);
export const deca = makePrefix(1);

export const deci = makePrefix(-1);
export const centi = makePrefix(-2);
export const milli = makePrefix(-3);
export const micro = makePrefix(-6);
export const nano = makePrefix(-9);
export const pico = makePrefix(-12);
export const femto = makePrefix(-15);
export const atto = makePrefix(-18);
export const zepto = makePrefix(-21);
export const yocto = makePrefix(-24);

// Non-SI Units

export const minute = derivedUnit<Time>(second(60));
export const hour = derivedUnit<Time>(minute(60));
export const day = derivedUnit<Time>(hour(24));
export const astronomicalUnit = derivedUnit<Length>(meter(149597870700));
export const degree = derivedUnit<PlanarAngle>(radian(Math.PI / 180));
export const minuteAngle = derivedUnit<PlanarAngle>(degree(1 / 60));
export const secondAngle = derivedUnit<PlanarAngle>(minuteAngle(1 / 60));
export const hectare = derivedUnit<Area>(uMultiply(meter(10000), meter(1)));
export const tonne = derivedUnit<Mass>(kilogram(1000));

(() => {
  // For Testing:
  type Two = Add<One, One>;
  type Three = Add<Two, One>;
  type Four = Add<Three, One>;
  type Five = Add<Four, One>;
  const test = <T extends Num>(_: T) => {};
  test<Zero>('+');
  test<One>('+1');
  test<Two>('+11');
  test<Three>('+111');
  test<Four>('+1111');
  test<Five>('+11111');
  test<Negate<Zero>>('+');
  test<Negate<One>>('-1');
  test<Negate<Two>>('-11');
  test<Negate<Three>>('-111');
  test<Negate<Four>>('-1111');
  test<Negate<Five>>('-11111');
  test<Add<Zero, Zero>>('+');
  test<Add<Zero, Negate<Zero>>>('+');
  test<Add<Zero, One>>('+1');
  test<Add<One, Zero>>('+1');
  test<Add<Three, Five>>('+11111111');
  test<Add<Five, Five>>('+1111111111');
  test<Add<Five, Three>>('+11111111');
  test<Add<Negate<Zero>, Zero>>('+');
  test<Add<Negate<Zero>, Negate<One>>>('-1');
  test<Add<Negate<One>, Zero>>('-1');
  test<Add<Three, Negate<Five>>>('-11');
  test<Add<Negate<Five>, Negate<Five>>>('-1111111111');
  test<Add<Five, Negate<Three>>>('+11');
  test<Subtract<Negate<Four>, Three>>('-1111111');
  test<Subtract<Five, Four>>('+1');
  test<Subtract<Two, Five>>('-111');
  test<Subtract<Add<Five, Five>, One>>('+111111111');
  test<Subtract<Subtract<Negate<Five>, Five>, Five>>('-111111111111111');
  test<Add<One, Add<One, Add<One, Add<One, Add<One, Add<One, Add<One, Add<One, One>>>>>>>>>(
    '+111111111'
  );
  test<Subtract<Negate<Five>, Add<Five, Add<Five, Add<Five, Five>>>>>('-1111111111111111111111111');
  const testQ = <T extends Quantity>(_: T) => {};
  testQ<{}>({});
  testQ<{}>({ anythingCanGoHere: '+33lkj2j22' });
  testQ<AddQ<{}, { a: '+1' }>>({ a: '+1' });
  testQ<AddQ<{ a: '+1' }, { a: '+1' }>>({ a: '+11' });
  testQ<AddQ<{ a: '+1' }, { a: '+1'; b: '+1' }>>({ a: '+11', b: '+1' });
  testQ<AddQ<{ a: '+1' }, { a: '+1'; b: '-1' }>>({ a: '+11', b: '-1' });
  testQ<AddQ<{ a: '+11' }, { a: '+1'; b: '-1' }>>({ a: '+111', b: '-1' });
  testQ<AddQ<{ a: '+11' }, { a: '-1'; b: '-1' }>>({ a: '+1', b: '-1' });
  testQ<SubtractQ<{}, { a: '+1' }>>({ a: '-1' });
  testQ<SubtractQ<{ b: '+1' }, { a: '+1' }>>({ a: '-1', b: '+1' });
  testQ<SubtractQ<{ a: '+1'; b: '+1' }, { a: '+1' }>>({ b: '+1' });
  testQ<SubtractQ<{ a: '+1'; b: '+1' }, { a: '+1' }>>({ b: '+1' });
  testQ<SubtractQ<{ length: '+1'; time: '+1' }, { time: '+1' }>>({ length: '+1' });
  testQ<AddQ<{ length: '+1'; time: '+1' }, { time: '-1' }>>({ length: '+1' });
  convertTo(uMultiply(hour(5), uDivide(meter(1), second(1))))(kilo.meter);
})();
