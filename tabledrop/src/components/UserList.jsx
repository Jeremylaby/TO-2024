import {useEffect, useState} from "react";
import NavBar from "./Home/NavBar.jsx";
import Container from "react-bootstrap/Container";
import {Table} from "react-bootstrap";
import UserElement from "./UserElement.jsx";

const UserList = () =>{
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchUsers = () => {
        setError(null);
        setLoading(true);
        return fetch('api/users', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Błąd podczas pobierania danych');
                }
                return response.json();
            })
            .then((data) => setUsers(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    if(loading) return(<h1>Loading...</h1>)
    if(error) return(<h1>Error: {error}</h1>)
    return (
        <div>
            <NavBar/>
            <Container fluid >

                <h3 className="mt-4">Users</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="5%">id</th>
                        <th width="20%">FirstName</th>
                        <th width="20%">LastName</th>
                        <th width="20%">email</th>
                        <th width="20%">role</th>
                        <th width="25%"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map( user => <UserElement user={user} fetchUsers={fetchUsers} key={user.id}/>)}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
};
export default UserList