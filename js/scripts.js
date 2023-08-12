const inputValue = document.querySelector("#input");
const fromBase = document.querySelector("#fromBase");
const toBase = document.querySelector("#toBase");
const result = document.querySelector("#result");
const btnConvert = document.querySelector("#btn-convert");
const btnReset = document.querySelector("#btn-reset");
const selects = document.querySelectorAll("select");
const error = document.getElementById("error");
const errorSelect = document.querySelectorAll("#errorSelect");

//Exibi resultados
btnConvert.addEventListener("click", () => {
  let convertedValue;

  if (fromBase.value === "10") {
    convertedValue = decimalToAny(inputValue.value, parseInt(toBase.value));
  } else if (toBase.value === "10") {
    convertedValue = anyToDecimal(inputValue.value, fromBase.value);
  } else {
    let toDecimal = anyToDecimal(inputValue.value, fromBase.value);
    convertedValue = decimalToAny(toDecimal, parseInt(toBase.value));
  }
  result.innerText = convertedValue;
});

const maxDigits = 10;

//Converte de decimal para qualquer base
function decimalToAny(num, base) {
  let result = "";

  if (num.includes(".")) {
    let intPart = parseInt(num.split(".")[0], 10);
    let decPart = parseFloat(`0.${num.split(".")[1]}`);

    let intResult = divideIntPart(intPart, base);
    let floatResult = multiplyFloatPart(decPart, base);

    result = `${intResult}.${floatResult}`;
  } else {
    result = divideIntPart(num, base);
  }
  return result;
}

//Converte caracteres e num hexadecimal
function convertHexChar(hexChar) {
  const hexLetters = "ABCDEF";

  // Se o caractere for uma letra entre A e F (ou a e f), converte para o valor decimal correspondente
  if (/[A-Fa-f]/.test(hexChar)) {
    //10 + (index de 0 a 5 correspondente a posição da letra de hexChar)
    return 10 + hexLetters.indexOf(hexChar.toUpperCase());
    //Se o caractere for um numero entre 10-15, converte para a letra correspondente
  } else if (parseInt(hexChar) >= 10) {
    return hexLetters[parseInt(hexChar) - 10];
  }
  return parseInt(hexChar);
}

//Converte parte inteira do numero (decimal para qualquer)
function divideIntPart(num, base) {
  let [dividend, divisor] = [num, base];
  let result = "";

  while (dividend >= divisor) {
    const remainder = Math.floor(dividend % divisor);
    if (remainder >= 10) {
      result = convertHexChar(remainder) + result;
    } else {
      result = remainder.toString() + result;
    }
    dividend = Math.floor(dividend / divisor);
  }
  if (dividend >= 10) {
    result = convertHexChar(dividend) + result;
  } else {
    result = dividend.toString() + result;
  }

  return result;
}

//Converte parte float(decimal) do numero (decimal para qualquer)
function multiplyFloatPart(num, base) {
  let result = "";
  let count = 0;

  while (num !== 0 && count < maxDigits) {
    const product = num * base;
    const intPart = Math.floor(product);
    result = result + intPart.toString();
    num = product - intPart;
    count++;
  }
  return result;
}

//Converte base qualquer para base 10
function anyToDecimal(num, base) {
  let result = 0;

  //verifica se tem ponto decimal e define o expoente com base na posição do ponto ou no tam da string
  let exp = num.indexOf(".") !== -1 ? num.indexOf(".") - 1 : num.length - 1;

  for (let i = 0; i < num.length; i++) {
    if (num[i] === ".") {
      exp = -1;
    } else {
      let digitValue;
      if (base === 16) {
        digitValue = convertHexChar(num[i]);
      } else {
        digitValue = parseInt(num[i], base);
      }
      result += digitValue * Math.pow(base, exp);
      exp--;
    }
  }
  return result.toString();
}

// Valida input
inputValue.addEventListener("input", () => {
  validateInput(inputValue);
});

// Valida selects
toBase.addEventListener("change", () => {
  validateSelection();
});

fromBase.addEventListener("change", () => {
  validateSelection();
});

function validateInput(input) {
  let regex = /^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?\.?$/;
  // let isBinary = /^[0-1]+$/.test(inputValue.value);1010.1110
  let isBinary = /^[0-1.]+$/.test(inputValue.value);

  if (!regex.test(input.value)) {
    error.textContent =
      "Informe apenas caracteres válidos: . (ponto final), 0-9, A-F";
    btnConvert.disabled = true;
  } else if (input.value === "") {
    btnConvert.disabled = true;
  } else if (fromBase.value === "2") {
    error.textContent = isBinary ? "" : "Informe um número binário válido.";
    btnConvert.disabled = !isBinary;
  } else {
    error.textContent = "";
    btnConvert.disabled = false;
  }
}

function validateSelection() {
  const selectedToBase = toBase.value;
  const selectedFromBase = fromBase.value;

  errorSelect[0].textContent =
    selectedFromBase === "" ? "Selecione a base numérica." : "";
  errorSelect[1].textContent =
    selectedToBase === "" ? "Selecione a base numérica." : "";

  btnConvert.disabled = selectedFromBase === "" || selectedToBase === "";

  if (selectedToBase === selectedFromBase) {
    error.textContent = "Não é permitido selecionar bases iguais.";
    btnConvert.disabled = true;
  } else {
    error.textContent = "";
    btnConvert.disabled = false;
  }
}

//Scrollar opções do select
selects.forEach((select) => {
  let isScrolling = false;

  select.addEventListener("mouseover", () => {
    isScrolling = true;
  });

  select.addEventListener("mouseout", () => {
    isScrolling = false;
  });

  select.addEventListener("wheel", (event) => {
    if (isScrolling) {
      event.preventDefault();
      //event.deltaY para determinar a direção da rolagem (Math.sign para obter o valor de -1, 0 ou 1)
      const delta = Math.sign(event.deltaY);
      const currentOptionIndex = select.selectedIndex;
      const newOptionIndex = currentOptionIndex + delta;
      //garante que o novo índice esteja dentro dos limites das opções disponíveis na caixa de seleção
      if (newOptionIndex >= 0 && newOptionIndex < select.options.length) {
        select.selectedIndex = newOptionIndex;
      }
    }
  });
});

//Limpa campos
btnReset.addEventListener("click", () => {
  inputValue.value = "";
  result.textContent = "";
  error.textContent = "";
});
