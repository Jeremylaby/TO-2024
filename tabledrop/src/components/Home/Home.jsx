import NavBar from "./NavBar.jsx";
import HomePage from "./HomePage.jsx";

const Home = () =>{
     return(
        <div bg="dark" className={"d-flex flex-column "}>
            <NavBar/>
            <HomePage/>
        </div>
     )
};
export default Home