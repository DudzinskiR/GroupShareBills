const shortenNumber = (number: number): string => {
  const isNegative = number < 0;
  number = Math.abs(number);

  if (number < 1000) return `${isNegative ? "-" : ""}${number}`;
  else if (number < 1000000) {
    return `${isNegative ? "-" : ""}${(number / 1000).toFixed(1)}k`;
  } else {
    return `${isNegative ? "-" : ""}${(number / 1000000).toFixed(1)}M`;
  }
};

export default shortenNumber;
