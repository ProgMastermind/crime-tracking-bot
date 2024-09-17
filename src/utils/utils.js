// utils.js

export const validateInput = (input, type) => {
  switch (type) {
    case "name":
      return /^[A-Za-z\s]{2,50}$/.test(input);
    case "age": {
      const age = parseInt(input);
      return !isNaN(age) && age >= 18 && age <= 99;
    }
    case "mobile":
      return /^\d{10}$/.test(input);
    case "text":
      return input.trim().length > 0 && input.trim().length <= 500;
    case "lettersOnly":
      return /^[A-Za-z\s.,!?]{2,500}$/.test(input);
    default:
      return true;
  }
};
