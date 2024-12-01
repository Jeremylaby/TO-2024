import Container from "react-bootstrap/Container";
import Image from 'react-bootstrap/Image';

const HomePage = () =>{
    return(
        <Container className={"d-flex flex-column justify-content-center"}>
            <h1>Ale kino</h1>
            <Image src="/absolute.jpg" className="w-100" fluid />
        </Container>
    )
};
export default HomePage;