import { create, all } from 'mathjs';
import { isNumberOk, isSymbolEquals } from './util.js';
import {
  getLastValue,
  getParsedInputString,
  hasLastOperation,
  hasLastValue,
  hasNewInput,
  MAX_DIGITS_IN_INPUT,
  reportNoNewInput,
  setResultError,
  setLastOperation,
  getLastOperation,
  setLastValue,
  setStringToInput,
} from './input.js';

const MathSettings = {
  precision: MAX_DIGITS_IN_INPUT,
  lowerExp: -14,
  upperExp: 15,
  predictable: true,
};

const math = create(all, MathSettings);

export const evaluateExpression = (expression) =>
  math.format(math.evaluate(expression), MathSettings);

const getCurrentUnaryExpression = (operation) => {
  const x = getParsedInputString();

  switch (operation) {
    case 'reciprocal':
      return `1 / (${x})`;
    case 'power-2':
      return `(${x}) ^ 2`;
    case 'power-3':
      return `(${x}) ^ 3`;
    case 'square-root':
      return `sqrt(${x})`;
    default:
      return `${x}`;
  }
};

const getCurrentBinaryExpression = () => {
  const x = getLastValue();
  const y = getParsedInputString();
  const operationSymbol = getLastOperation();

  return `(${x}) ${operationSymbol} (${y})`;
};

export const calcUnary = (operation) => {
  const result = evaluateExpression(getCurrentUnaryExpression(operation));

  if (!isNumberOk(result)) {
    setResultError();
    return;
  }

  setStringToInput(result);
};

export const calcBinary = (operationSymbol) => {
  if (
    isSymbolEquals(operationSymbol) &&
    (!hasLastOperation() || !hasLastValue())
  ) {
    return;
  }

  if (!hasLastValue()) {
    setLastValue(getParsedInputString());

    if (!isSymbolEquals(operationSymbol)) {
      setLastOperation(operationSymbol);
    }

    reportNoNewInput();
    return;
  }

  if (!hasNewInput() && !isSymbolEquals(operationSymbol)) {
    if (!isSymbolEquals(operationSymbol)) {
      setLastOperation(operationSymbol);
    }

    return;
  }

  const result = evaluateExpression(getCurrentBinaryExpression());

  if (!isNumberOk(result)) {
    setResultError();
    return;
  }

  setStringToInput(result);
  setLastValue(result);
  reportNoNewInput();

  if (!isSymbolEquals(operationSymbol)) {
    setLastOperation(operationSymbol);
  }
};
