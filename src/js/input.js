import {
  getCountOfDigits,
  getDigits,
  removeLastSymbol,
  isNumberOk,
} from './util.js';
import { evaluateExpression } from './calc.js';
import { disableButtonsExceptClear, enableAllButtons } from './buttons';

const Chars = {
  MINUS: '-',
  DECIMAL_SEPARATOR: '.',
  GROUPING_SEPARATOR: ',',
};

const DefaultInputValues = {
  CONTENT: '0',
  LAST_OPERATION: '',
  LAST_VALUE: '',
};

const InputFontSettings = {
  DEFAULT_SIZE: 32,
  MIN_SIZE: 21,
  SYMBOL_WIDTH: 28,
  COMPRESSION_RATIO: 1.05,
};

const ERROR_MESSAGE = 'Error';

export const MAX_DIGITS_IN_INPUT = 15;

const ioInputNode = document.querySelector('.input__field');

export const setLastOperation = (operationSymbol) => {
  ioInputNode.dataset.lastOperation = operationSymbol;
};

export const getLastOperation = () => ioInputNode.dataset.lastOperation;

export const hasLastOperation = () =>
  getLastOperation() !== DefaultInputValues.LAST_OPERATION;

const clearLastOperation = () => {
  setLastOperation(DefaultInputValues.LAST_OPERATION);
};

export const setLastValue = (value) => {
  ioInputNode.dataset.lastValue = value;
};

export const getLastValue = () => ioInputNode.dataset.lastValue;

export const hasLastValue = () =>
  getLastValue() !== DefaultInputValues.LAST_VALUE;

const clearLastValue = () => {
  setLastValue(DefaultInputValues.LAST_VALUE);
};

export const fitInputContent = () => {
  const excessedLettersCount =
    ioInputNode.textContent.length -
    Math.ceil(ioInputNode.clientWidth / InputFontSettings.SYMBOL_WIDTH);

  const newFontSize = Math.max(
    excessedLettersCount > 0
      ? InputFontSettings.DEFAULT_SIZE -
          excessedLettersCount * InputFontSettings.COMPRESSION_RATIO
      : InputFontSettings.DEFAULT_SIZE,
    InputFontSettings.MIN_SIZE,
  );

  ioInputNode.style.fontSize = newFontSize + 'px';
};

const getInputString = () =>
  ioInputNode.textContent
    .trim()
    .replace(new RegExp(`${Chars.GROUPING_SEPARATOR}`, 'g'), '');

export const getParsedInputString = () => evaluateExpression(getInputString());

const isInputEmpty = () => getInputString() === DefaultInputValues.CONTENT;

const isInputNegative = () => getInputString()[0] === Chars.MINUS;

const isInputFinite = () => isFinite(getInputString());

const hasDecimalSeparatorInInput = () =>
  getInputString().includes(Chars.DECIMAL_SEPARATOR);

export const setStringToInput = (string) => {
  let resultString = string.trim();

  if (isNumberOk(resultString)) {
    const numberParts = resultString.split(Chars.DECIMAL_SEPARATOR);

    let integerPart = numberParts[0];
    const fractionalPart = numberParts[1] ?? null;

    const integerPartDigits = Number(getDigits(integerPart));
    integerPart = integerPart.replace(
      new RegExp(integerPartDigits),
      integerPartDigits.toLocaleString('en-US'),
    );

    resultString = `${integerPart}${
      resultString.includes(Chars.DECIMAL_SEPARATOR) || fractionalPart
        ? Chars.DECIMAL_SEPARATOR
        : ''
    }${fractionalPart ?? ''}`;
  }

  ioInputNode.textContent = resultString;
  fitInputContent();
};

const clearInputString = () => {
  setStringToInput(DefaultInputValues.CONTENT);
};

export const reportNoNewInput = () => {
  ioInputNode.dataset.hasNewInput = 'false';
};

const reportNewInput = () => {
  ioInputNode.dataset.hasNewInput = 'true';
};

export const hasNewInput = () => ioInputNode.dataset.hasNewInput === 'true';

export const setResultError = () => {
  setStringToInput(ERROR_MESSAGE);
  disableButtonsExceptClear();
};

const hasResultError = () => getInputString() === ERROR_MESSAGE;

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

  const isInputZeroWithDecimalSeparator =
    Number(getParsedInputString()) === 0 && hasDecimalSeparatorInInput();

  if (
    getParsedInputString() > 0 ||
    (isInputZeroWithDecimalSeparator && !isInputNegative())
  ) {
    setStringToInput(`${Chars.MINUS}${getInputString()}`);
    return;
  }

  if (
    getParsedInputString() < 0 ||
    (isInputZeroWithDecimalSeparator && isInputNegative())
  ) {
    setStringToInput(
      getInputString().replace(new RegExp(`[${Chars.MINUS}]`, 'g'), ''),
    );
    return;
  }
};

export const removeLastSymbolInInput = () => {
  if (isInputEmpty() || !hasNewInput() || !isInputFinite()) {
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
    getCountOfDigits(getInputString()) >= MAX_DIGITS_IN_INPUT ||
    (symbol === Chars.DECIMAL_SEPARATOR && hasDecimalSeparatorInInput())
  ) {
    return;
  }

  setStringToInput(
    `${
      !isInputEmpty() || symbol === Chars.DECIMAL_SEPARATOR
        ? getInputString()
        : ''
    }${symbol}`,
  );
};
