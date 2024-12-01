import Container from "react-bootstrap/Container";
import Image from 'react-bootstrap/Image';
import NavBar from "../components/NavBar.jsx";

const Home = () => {
  return (
    <div className={"d-flex flex-column "}>
      <NavBar />
      <Container className={"d-flex flex-column justify-content-center"}>
            <h1>Ale kino</h1>
            <Image src="/absolute.jpg" className="w-100" fluid />
        </Container>
    </div>
  );
};
export default Home;
