import {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";
import UserElement from "../components/UserElement";
import Typography from "@mui/material/Typography";

const UserList = () =>{
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchUsers = () => {
        setError(null);
        setLoading(true);
        return fetch('/api/user', {
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
        <Box>
            <NavBar />
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    Users
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "5%" }}>ID</TableCell>
                                <TableCell sx={{ width: "20%" }}>First Name</TableCell>
                                <TableCell sx={{ width: "20%" }}>Last Name</TableCell>
                                <TableCell sx={{ width: "20%" }}>Email</TableCell>
                                <TableCell sx={{ width: "15%" }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <UserElement user={user} fetchUsers={fetchUsers} key={user.id} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
};
export default UserList