import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import AuthWrapper from "../components/AuthForm/AuthWrapper";
import EmailInput from "../components/AuthForm/EmailInput";
import PasswordInput from "../components/AuthForm/PasswordInput";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';

import {
  isConfirmPasswordValid,
  isEmailValid,
  isPasswordValid,
} from "../components/AuthForm/inputValidation";

const SignUpFooter = () => (
  <Typography sx={{ textAlign: "center" }}>
    Already have an account?{" "}
    <Link
      href="/material-ui/getting-started/templates/login/"
      variant="body2"
      sx={{ alignSelf: "center" }}
    >
      Log in
    </Link>
  </Typography>
);

const SignUp = () => {
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEmailError || isPasswordError || isConfirmPasswordError) {
      return;
    }

    const data = new FormData(event.currentTarget);

    const firstName = data.get("first-name");
    const lastName = data.get("last-name");
    const email = data.get("email");
    const password = data.get("password");

    const success = await signUp(firstName, lastName, email, password);

    if (success) {
      navigate('/account');    
      console.log("Rejestracja zakończona sukcesem");
    } else {
      navigate('/signup', { state: { error: 'Rejestracja nie powiodła się. Spróbuj ponownie.' } });
      console.log("Błąd podczas rejestracji");
    }
  };

  const validateInputs = () => {
    return (
      isEmailValid(setIsEmailError, setEmailErrorMessage) &&
      isPasswordValid(setIsPasswordError, setPasswordErrorMessage) &&
      isConfirmPasswordValid(
        setIsConfirmPasswordError,
        setConfirmPasswordErrorMessage
      )
    );
  };

  return (
    <AuthWrapper
      Footer={SignUpFooter}
      headerText="Sign up"
      submitButtonText="Sign up"
      handleSubmit={handleSubmit}
      validateInputs={validateInputs}
    >
      <FormControl>
        <FormLabel htmlFor="first-name" sx={{ textAlign: "left" }}>
          First name
        </FormLabel>
        <TextField
          id="first-name"
          type="first-name"
          name="first-name"
          placeholder="John"
          autoComplete="first-name"
          autoFocus
          required
          fullWidth
          variant="outlined"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="last-name" sx={{ textAlign: "left" }}>
          Last name
        </FormLabel>
        <TextField
          id="last-name"
          type="last-name"
          name="last-name"
          placeholder="Doe"
          autoComplete="last-name"
          autoFocus
          required
          fullWidth
          variant="outlined"
        />
      </FormControl>
      <EmailInput isError={isEmailError} errorMessage={emailErrorMessage} />
      <PasswordInput
        isError={isPasswordError}
        errorMessage={passwordErrorMessage}
      />
      <PasswordInput
        isError={isConfirmPasswordError}
        errorMessage={confirmPasswordErrorMessage}
        isConfirm
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
    </AuthWrapper>
  );
};

export default SignUp;
