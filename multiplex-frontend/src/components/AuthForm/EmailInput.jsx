import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const EmailInput = ({ isError, errorMessage }) => {
  return (
    <FormControl>
      <FormLabel htmlFor="email" sx={{ textAlign: "left" }}>
        Email
      </FormLabel>
      <TextField
        error={isError}
        helperText={errorMessage}
        id="email"
        type="email"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        autoFocus
        required
        fullWidth
        variant="outlined"
        color={isError ? "error" : "primary"}
      />
    </FormControl>
  );
};

EmailInput.propTypes = {
  isError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};

export default EmailInput;
