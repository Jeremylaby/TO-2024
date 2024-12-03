import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import AuthWrapper from "../components/AuthForm/AuthWrapper";
import EmailInput from "../components/AuthForm/EmailInput";
import PasswordInput from "../components/AuthForm/PasswordInput";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import {
  isEmailValid,
  isPasswordValid,
} from "../components/AuthForm/inputValidation";

const LoginFooter = () => (
  <Typography sx={{ textAlign: "center" }}>
    Don&apos;t have an account?{" "}
    <Link
      href="/material-ui/getting-started/templates/sign-in/"
      variant="body2"
      sx={{ alignSelf: "center" }}
    >
      Sign up
    </Link>
  </Typography>
);

const Login = () => {
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEmailError || isPasswordError) {
      return;
    }

    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");

    const success = await login(email, password);

    if (success) {
      navigate('/account');    
      console.log("Logowanie zakończone sukcesem");
    } else {
      navigate('/login', { state: { error: 'Logowanie nie powiodło się. Spróbuj ponownie.' } });
      console.log("Błąd podczas logowania");
    }
  };

  const validateInputs = () => {
    return (
      isEmailValid(setIsEmailError, setEmailErrorMessage) &&
      isPasswordValid(setIsPasswordError, setPasswordErrorMessage)
    );
  };

  return (
    <AuthWrapper
      Footer={LoginFooter}
      headerText="Sign in"
      submitButtonText="Sign in"
      handleSubmit={handleSubmit}
      validateInputs={validateInputs}
    >
      <EmailInput isError={isEmailError} errorMessage={emailErrorMessage} />
      <PasswordInput
        isError={isPasswordError}
        errorMessage={passwordErrorMessage}
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
    </AuthWrapper>
  );
};

export default Login;
