import { N, OneQuantity, Mul2, Mul3 } from '../Quantity';

// Basic quantities
export const time = 'time';
export const length = 'length';
export const mass = 'mass';
export const electricCurrent = 'electricCurrent';
export const temperature = 'temperature';
export const amountOfSubstance = 'amountOfSubstance';
export const luminousIntensity = 'luminousIntensity';

export type Time = OneQuantity<typeof time>;
export type Length = OneQuantity<typeof length>;
export type Mass = OneQuantity<typeof mass>;
export type ElectricCurrent = OneQuantity<typeof electricCurrent>;
export type Temperature = OneQuantity<typeof temperature>;
export type AmountOfSubstance = OneQuantity<typeof amountOfSubstance>;
export type LuminousIntensity = OneQuantity<typeof luminousIntensity>;

// Not "real" quantities, but this helps the type system work out better
export const planarAngle = 'planarAngle'
export const solidAngle = 'solidAngle'

export type PlanarAngle = OneQuantity<typeof planarAngle>;
export type SolidAngle = OneQuantity<typeof solidAngle>;

// Derived quantities
export type Frequency = N<Time>;
export type Force = Mass & Length & N<Mul2<Time>>;
export type Pressure = Mass & N<Length> & N<Mul2<Time>>;
export type Energy = Mass & Mul2<Length> & N<Mul2<Time>>;
export type Power = Mass & Mul2<Length> & N<Mul3<Time>>;
export type ElectricCharge = Time & ElectricCurrent;
export type ElectricPotential = Mass & Mul2<Length> & N<Mul3<Time>> & N<ElectricCurrent>;
export type Capacitance = N<Mass> & N<Mul2<Length>> & Mul2<Mul2<Time>> & Mul2<ElectricCurrent>;
export type Resistance = Mass & Mul2<Length> & N<Mul3<Time>> & N<Mul2<ElectricCurrent>>;
export type ElectricalConductance = N<Mass> & N<Mul2<Length>> & Mul3<Time> & Mul2<ElectricCurrent>;
export type MagneticFlux = Mass & Mul2<Length> & N<Mul2<Time>> & N<ElectricCurrent>;
export type MagneticFluxDensity = Mass & N<Mul2<Time>> & N<ElectricCurrent>;
export type Inductance = Mass & Mul2<Length> & N<Mul2<Time>> & N<Mul2<ElectricCurrent>>;
export type LuminousFlux = LuminousIntensity & SolidAngle;
export type Illuminance = LuminousIntensity & SolidAngle & N<Mul2<Length>>;
export type Radioactivity = Frequency;
export type AbsorbedDose = Mul2<Length> & N<Mul2<Time>>;
export type EquivalentDose = AbsorbedDose;
export type CatalyticActivity = AmountOfSubstance & N<Time>;
export type Area = Mul2<Length>;
