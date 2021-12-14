import { baseUnitForQuantity } from '../Measurement';
import * as Q from '../Quantities';

export const second = baseUnitForQuantity('time', 's');
export const meter = baseUnitForQuantity('length', 'm');
export const kilogram = baseUnitForQuantity('mass', 'kg');
export const ampere = baseUnitForQuantity('electricCurrent', 'A');
export const kelvin = baseUnitForQuantity('thermodynamicTemperature', 'K');
export const mole = baseUnitForQuantity('amountOfSubstance', 'mol');
export const candela = baseUnitForQuantity('luminousIntensity', 'cd');

// SI Derived Units

export const gram = kilogram(0.001).named<Q.Mass>('g');
export const radian = baseUnitForQuantity('planarAngle', 'rad');
export const steradian = baseUnitForQuantity('solidAngle', 'sr');
export const hertz = second(1).inverted().named<Q.Frequency>('Hz');
export const newton = kilogram(1).times(meter(1)).per(second(1).squared()).named<Q.Force>('N');
export const pascal = newton(1).per(meter(1).squared()).named<Q.Pressure>('Pa');
export const joule = newton(1).times(meter(1)).named<Q.Energy>('J');
export const watt = joule(1).per(second(1)).named<Q.Power>('W');
export const coulomb = second(1).times(ampere(1)).named<Q.ElectricCharge>('C');
export const volt = watt(1).per(ampere(1)).named<Q.ElectricPotential>('V');
export const farad = coulomb(1).per(volt(1)).named<Q.Capacitance>('F');
export const ohm = volt(1).per(ampere(1)).named<Q.Resistance>('Ω');
export const siemens = ohm(1).inverted().named<Q.ElectricalConductance>('S');
export const weber = volt(1).times(second(1)).named<Q.MagneticFlux>('Wb');
export const tesla = weber(1).per(meter(1).squared()).named<Q.MagneticFluxDensity>('T');
export const henry = weber(1).per(ampere(1)).named<Q.Inductance>('H');
export const lumen = candela(1).times(steradian(1)).named<Q.LuminousFlux>('lm');
export const lux = lumen(1).per(meter(1).squared()).named<Q.Illuminance>('lx');
export const becquerel = hertz(1).named<Q.Radioactivity>('Bq');
export const gray = joule(1).per(kilogram(1)).named<Q.AbsorbedDose>('Gy');
export const sievert = gray(1).named<Q.EquivalentDose>('Sv');
export const katal = mole(1).per(second(1)).named<Q.CatalyticActivity>('kat');

// Prefixes for all SI Units

const makePrefix = (exponent: number, prefix: string) => ({
  second: second(10 ** exponent).prefixed(prefix),
  meter: meter(10 ** exponent).prefixed(prefix),
  gram: gram(10 ** exponent).prefixed(prefix),
  ampere: ampere(10 ** exponent).prefixed(prefix),
  kelvin: kelvin(10 ** exponent).prefixed(prefix),
  mole: mole(10 ** exponent).prefixed(prefix),
  candela: candela(10 ** exponent).prefixed(prefix),
  radian: radian(10 ** exponent).prefixed(prefix),
  steradian: steradian(10 ** exponent).prefixed(prefix),
  hertz: hertz(10 ** exponent).prefixed(prefix),
  newton: newton(10 ** exponent).prefixed(prefix),
  pascal: pascal(10 ** exponent).prefixed(prefix),
  joule: joule(10 ** exponent).prefixed(prefix),
  watt: watt(10 ** exponent).prefixed(prefix),
  coulomb: coulomb(10 ** exponent).prefixed(prefix),
  volt: volt(10 ** exponent).prefixed(prefix),
  farad: farad(10 ** exponent).prefixed(prefix),
  ohm: ohm(10 ** exponent).prefixed(prefix),
  siemens: siemens(10 ** exponent).prefixed(prefix),
  weber: weber(10 ** exponent).prefixed(prefix),
  tesla: tesla(10 ** exponent).prefixed(prefix),
  henry: henry(10 ** exponent).prefixed(prefix),
  lumen: lumen(10 ** exponent).prefixed(prefix),
  lux: lux(10 ** exponent).prefixed(prefix),
  becquerel: becquerel(10 ** exponent).prefixed(prefix),
  gray: gray(10 ** exponent).prefixed(prefix),
  sievert: sievert(10 ** exponent).prefixed(prefix),
  katal: katal(10 ** exponent).prefixed(prefix),
});

export const yotta = makePrefix(24, 'Y');
export const zetta = makePrefix(21, 'Z');
export const exa = makePrefix(18, 'E');
export const peta = makePrefix(15, 'P');
export const tera = makePrefix(12, 'T');
export const giga = makePrefix(9, 'G');
export const mega = makePrefix(6, 'M');
export const kilo = makePrefix(3, 'k');
export const hecto = makePrefix(2, 'h');
export const deca = makePrefix(1, 'da');

export const deci = makePrefix(-1, 'd');
export const centi = makePrefix(-2, 'c');
export const milli = makePrefix(-3, 'm');
export const micro = makePrefix(-6, 'μ');
export const nano = makePrefix(-9, 'n');
export const pico = makePrefix(-12, 'p');
export const femto = makePrefix(-15, 'f');
export const atto = makePrefix(-18, 'a');
export const zepto = makePrefix(-21, 'z');
export const yocto = makePrefix(-24, 'y');

// Non-SI Units

export const minute = second(60).named<Q.Time>('min');
export const hour = minute(60).named<Q.Time>('h');
export const day = hour(24).named<Q.Time>('d');
export const astronomicalUnit = meter(149597870700).named<Q.Length>('au');
export const degree = radian(Math.PI / 180).named<Q.PlanarAngle>('°');
export const minuteAngle = degree(1 / 60).named<Q.PlanarAngle>("'");
export const secondAngle = minuteAngle(1 / 60).named<Q.PlanarAngle>('"');
export const hectare = meter(10000).times(meter(1)).named<Q.Area>('ha');
export const tonne = kilogram(1000).named<Q.Mass>('t');
