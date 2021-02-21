function isValidNumber(number) {
  if (isNaN(number)) {
    return false;
  }

  if (!(typeof number === "number") || number === NaN || number === undefined)
    return false;
  else return true;
}

module.exports = isValidNumber;
