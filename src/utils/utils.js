// utils.js

export const validateInput = (input, type) => {
    switch (type) {
      case 'name':
        return /^[A-Za-z\s]{2,50}$/.test(input);
      case 'age':
        return /^\d{1,3}$/.test(input) && parseInt(input) > 0 && parseInt(input) < 120;
      case 'mobile':
        return /^\d{10}$/.test(input);
      case 'text':
        return input.trim().length > 0 && input.trim().length <= 500;
      case 'lettersOnly':
        return /^[A-Za-z\s.,!?]{2,500}$/.test(input);
      default:
        return true;
    }
  };
  