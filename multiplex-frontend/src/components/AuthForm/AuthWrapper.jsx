import AdbIcon from "@mui/icons-material/Adb";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const FormFooter = ({ Footer }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Footer />
  </Box>
);

FormFooter.propTypes = {
    Footer: PropTypes.func,
  };

const AuthWrapper = ({
  children,
  Footer,
  headerText,
  submitButtonText,
  handleSubmit,
  validateInputs,
}) => (
  <SignInContainer direction="column" justifyContent="space-between">
    <Card variant="outlined">
      {!!headerText && (
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "left",
          }}
        >
          {headerText}
        </Typography>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        {children}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          {submitButtonText}
        </Button>
        <Link
          component="button"
          type="button"
          variant="body2"
          sx={{ alignSelf: "center" }}
        >
          Forgot your password?
        </Link>
      </Box>
      <Divider>or</Divider>
      <FormFooter Footer={Footer} />
    </Card>
  </SignInContainer>
);

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  Footer: PropTypes.func,
  headerText: PropTypes.string,
  submitButtonText: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validateInputs: PropTypes.func.isRequired,
};

export default AuthWrapper;
