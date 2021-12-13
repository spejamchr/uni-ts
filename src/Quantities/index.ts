import { N, OneQuantity, Mul2, Mul3 } from '../Quantity';

// Basic quantities
export type Time = OneQuantity<'time'>;
export type Length = OneQuantity<'length'>;
export type Mass = OneQuantity<'mass'>;
export type ElectricCurrent = OneQuantity<'electricCurrent'>;
export type ThermodynamicTemperature = OneQuantity<'thermodynamicTemperature'>;
export type AmountOfSubstance = OneQuantity<'amountOfSubstance'>;
export type LuminousIntensity = OneQuantity<'luminousIntensity'>;

// Not "real" quantities, but this makes the type system work out better
export type PlanarAngle = OneQuantity<'planarAngle'>;
export type SolidAngle = OneQuantity<'solidAngle'>;

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
