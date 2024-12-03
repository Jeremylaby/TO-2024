import { Box, Container } from "@mui/material";
import NavBar from "../components/NavBar.jsx";

const Home = () => {
  return (
    <div className={"d-flex flex-column "}>
      <NavBar />
      <Container className={"d-flex flex-column justify-content-center"}>
        <h1>Ale kino</h1>
        <Box
          component="img"
          sx={{
            width: 1,
          }}
          alt="The house from the offer."
          src="/absolute.jpg"
        />
      </Container>
    </div>
  );
};
export default Home;
