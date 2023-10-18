export const getConstantCaseFromKebabCase = (string) =>
  string.toUpperCase().replace(/[-]/g, '_');

export const removeLastSymbol = (string) => string.slice(0, string.length - 1);

export const getDigits = (string) => string.replace(/[\D]/g, '');

export const getCountOfDigits = (string) => getDigits(string).length;

export const arrayToSpaceSeparatedString = (array) => array.join(' ');

export const isNumberOk = (number) =>
  !(Number.isNaN(Number(number)) || !isFinite(Number(number)));

export const isSymbolEquals = (symbol) => symbol === '=';
