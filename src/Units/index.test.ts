import * as U from '.';

test('display 1 second correctly', () => {
  expect(U.second(1).toString()).toBe('1 s');
  expect(String(U.second(1))).toBe('1 s');
  expect(`${U.second(1)}`).toBe('1 s');
});

test('display various units correctly', () => {
  expect(String(U.kilo.meter(40).per(U.hour(1)))).toBe('40 km*(h)^-1')
  expect(String(U.minute(10).inverted().times(U.meter(20)))).toBe('2 (min)^-1*m')
  expect(String(U.meter(1).times(U.meter(1)))).toBe('1 m^2')
  expect(String(U.meter(1).per(U.meter(1)))).toBe('1 ')
  expect(String(U.meter(1).times(U.kilo.meter(1)))).toBe('1 m*km')
  expect(String(U.meter(1).per(U.kilo.meter(1)))).toBe('1 m*(km)^-1')
})

test('conversion works', () => {
  expect(String(U.kilo.meter(2.3).into(U.meter))).toBe('2300 m')
  expect(String(U.day(1).into(U.second))).toBe('86400 s')
  expect(String(U.hour(2).into(U.minute))).toBe('120 min')
})
