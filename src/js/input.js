import { getCountOfDigits, getDigits, removeLastSymbol, isNumberOk } from './util';
import { evaluateExpression } from './calc.js';
import { disableButtonsExceptClear, enableAllButtons } from './buttons';

const MINUS = '-';
const DECIMAL_SEPARATOR = '.';
const GROUPING_SEPARATOR = ',';

const DEFAULT_INPUT_STRING = '0';
const NO_OPERATION_STRING = '';
const NO_VALUE_STRING = '';
const ERROR_MESSAGE = 'Error';

export const MAX_DIGITS_IN_INPUT = 15;

const DEFAULT_INPUT_FONT_SIZE = 32;
const MIN_INPUT_FONT_SIZE = 21;
const DEFAULT_INPUT_SYMBOL_WIDTH = 28;
const INPUT_FONT_SIZE_COMPRESSION_RATIO = 1.05;

const ioInputNode = document.querySelector('.input__field');

export const fitInputContent = () => {
  const excessedLettersCount = ioInputNode.textContent.length - Math.ceil(ioInputNode.clientWidth / DEFAULT_INPUT_SYMBOL_WIDTH);

  const newFontSize = Math.max((excessedLettersCount > 0 ? (DEFAULT_INPUT_FONT_SIZE - excessedLettersCount * INPUT_FONT_SIZE_COMPRESSION_RATIO) : DEFAULT_INPUT_FONT_SIZE), MIN_INPUT_FONT_SIZE);

  ioInputNode.style.fontSize = newFontSize + 'px';
};

export const getInputString = () => ioInputNode.textContent.trim().replace(new RegExp(`${GROUPING_SEPARATOR}`, 'g'), '');

export const getParsedInputString = () => evaluateExpression(getInputString());

export const isInputEmpty = () => getInputString() === DEFAULT_INPUT_STRING;

export const isInputNegative = () => getInputString()[0] === MINUS;

export const isInputFinite = () => isFinite(getInputString());

export const hasDecimalSeparatorInInput = () => getInputString().includes(DECIMAL_SEPARATOR);

export const setStringToInput = (string) => {
  let resultString = string.trim();

  if (isNumberOk(resultString)) {
    const numberParts = resultString.split(DECIMAL_SEPARATOR);

    let integerPart = numberParts[0];
    const fractionalPart = numberParts[1] ?? null;

    const integerPartDigits = Number(getDigits(integerPart));
    integerPart = integerPart.replace(new RegExp(integerPartDigits), integerPartDigits.toLocaleString());

    resultString = `${integerPart}${resultString.includes(DECIMAL_SEPARATOR) || fractionalPart ? DECIMAL_SEPARATOR : ''}${fractionalPart ?? ''}`;
  }

  ioInputNode.textContent = resultString;
  fitInputContent();
};

export const clearInputString = () => {
  setStringToInput(DEFAULT_INPUT_STRING);
};

export const reportNoNewInput = () => {
  ioInputNode.dataset.hasNewInput = 'false';
};

export const reportNewInput = () => {
  ioInputNode.dataset.hasNewInput = 'true';
};

export const hasNewInput = () => ioInputNode.dataset.hasNewInput === 'true';

export const setResultError = () => {
  setStringToInput(ERROR_MESSAGE);
  disableButtonsExceptClear();
};

export const hasResultError = () => getInputString() === ERROR_MESSAGE;

export const setLastOperation = (operationSymbol) => {
  ioInputNode.dataset.lastOperation = operationSymbol;
};

export const getLastOperation = () => ioInputNode.dataset.lastOperation;

export const hasLastOperation = () => getLastOperation() !== NO_OPERATION_STRING;

export const clearLastOperation = () => {
  setLastOperation(NO_OPERATION_STRING);
};

export const setLastValue = (value) => {
  ioInputNode.dataset.lastValue = value;
};

export const getLastValue = () => ioInputNode.dataset.lastValue;

export const hasLastValue = () => getLastValue() !== NO_VALUE_STRING;

export const clearLastValue = () => {
  setLastValue(NO_VALUE_STRING);
};

export const setInputToDefault = () => {
  if (hasResultError()) {
    enableAllButtons();
  }

  clearInputString();
  clearLastOperation();
  clearLastValue();
  reportNoNewInput();
};

export const clearCurrentEntry = () => {
  if (hasResultError()) {
    enableAllButtons();
  }

  clearInputString();
  reportNoNewInput();
};

export const setInputValueToOpposite = () => {
  if (isInputEmpty()) {
    return;
  }

  reportNewInput();

  const isZeroWithDecimalSeparator = Number(getParsedInputString()) === 0 && hasDecimalSeparatorInInput();

  if (
    getParsedInputString() > 0
    || (isZeroWithDecimalSeparator && !isInputNegative())
  ) {
    setStringToInput(`${MINUS}${getInputString()}`);
    return;
  }

  if (
    getParsedInputString() < 0
    || (isZeroWithDecimalSeparator && isInputNegative())
  ) {
    setStringToInput(getInputString().replace(new RegExp(`[${MINUS}]`, 'g'), ''));
    return;
  }
};

export const removeLastSymbolInInput = () => {
  if (
    isInputEmpty()
    || !hasNewInput()
    || !isInputFinite()
  ) {
    return;
  }

  if (getCountOfDigits(getInputString()) === 1) {
    clearInputString();
    return;
  }

  setStringToInput(removeLastSymbol(getInputString()));
};

export const addSymbolToInput = (symbol) => {
  if (!isInputFinite()) {
    return;
  }

  if (!hasNewInput()) {
    reportNewInput();

    if (!isInputEmpty()) {
      clearInputString();
    }
  }

  if (
    (getCountOfDigits(getInputString()) >= MAX_DIGITS_IN_INPUT)
    || (symbol === DECIMAL_SEPARATOR && hasDecimalSeparatorInInput())
  ) {
    return;
  }

  setStringToInput(`${!isInputEmpty() || symbol === DECIMAL_SEPARATOR ? getInputString() : ''}${symbol}`);
};
