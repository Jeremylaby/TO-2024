export const isEmailValid = (setIsError, setErrorMessage) => {
  const email = document.getElementById("email").value;
  let isValid;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setErrorMessage("Please enter a valid email address.");
    isValid = false;
  } else {
    setErrorMessage("");
    isValid = true;
  }

  setIsError(!isValid);
  return isValid;
};

export const isPasswordValid = (setIsError, setErrorMessage) => {
  const password = document.getElementById("password").value;
  let isValid;

  if (!password || password.length < 6) {
    setErrorMessage("Password must be at least 6 characters long.");
    isValid = false;
  } else {
    setErrorMessage("");
    isValid = true;
  }

  setIsError(!isValid);
  return isValid;
};

export const isConfirmPasswordValid = (setIsError, setErrorMessage) => {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  let isValid;

  if (confirmPassword !== password) {
    setErrorMessage("Passwords must match.");
    isValid = false;
} else {
    setErrorMessage("");
    isValid = true;
  }

  setIsError(!isValid);
  return isValid;
};
