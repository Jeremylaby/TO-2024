import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const PasswordInput = ({ isError, errorMessage, isConfirm = false }) => {
  const text = isConfirm ? "confirm-password" : "password";

  return (
    <FormControl>
      <FormLabel htmlFor={text} sx={{ textAlign: "left" }}>
        {isConfirm ? "Password confirmation" : "Password"}
      </FormLabel>
      <TextField
        error={isError}
        helperText={errorMessage}
        name={text}
        placeholder="••••••"
        type={text}
        id={text}
        autoComplete={`current${text}`}
        autoFocus
        required
        fullWidth
        variant="outlined"
        color={isError ? "error" : "primary"}
      />
    </FormControl>
  );
};

PasswordInput.propTypes = {
  isError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  isConfirm: PropTypes.bool,
};

export default PasswordInput;
