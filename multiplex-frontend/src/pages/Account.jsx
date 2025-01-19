import {
    Box,
    Card,
    CardContent,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Container, Button
} from "@mui/material"
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import NavBar from "../components/NavBar.jsx";
import {useAuth} from "../components/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
const Account = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate();

    const navigateToReservations = () => {
        navigate('/account/reservations');
    };

    const navigateToRatigs = () => {
        navigate('/account/ratings');
    };
    const handleLogout = async () =>{
        const success = await logout();
        if(success){
            navigate("/")
        }

    }

    const remove = async (user) => {
        await fetch(`/api/user/${user.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete user ");
                }
            }).then(handleLogout)
            .catch((error) => {
                console.error("Error while deleting user:", error);
            })
    };
    return (
        <div className={"d-flex flex-column "}>
            <NavBar/>
            <Container>
                <Box sx={{padding: 4, minHeight: '100vh'}}>
                    <Grid2 container spacing={2} columnSpacing={2} columns={12}>
                        <Grid2 size={{md: 12, sm: 12, xs: 12}}>
                            <Box
                                sx={{

                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                    p: 0,
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">Personal Information</Typography>
                                <Button variant="contained" color="error" onClick={handleLogout}>
                                    Sign out
                                </Button>
                            </Box>
                            <Divider/>
                        </Grid2>
                        <Grid2 size={{md: 3, sm: 12, xs: 12}}>
                            <Box
                                sx={{
                                    bgcolor: "background.paper",
                                    borderRadius: 2,
                                    padding: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        mb: 2,
                                    }}
                                >
                                    <Avatar
                                        sx={{width: 100, height: 100, mb: 2}}
                                        src="https://avatar.iran.liara.run/public/8"
                                        alt="User Avatar"
                                    />
                                    <Typography variant="h6">
                                        {user?.firstName} {user?.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {user?.email}
                                    </Typography>
                                </Box>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="Personal Information"
                                            primaryTypographyProps={{color: 'primary', fontWeight: 'bold'}}
                                        />
                                    </ListItem>
                                    <Divider/>
                                    <ListItem>
                                        <ListItemText
                                            onClick={navigateToReservations}
                                            sx={{ cursor: "pointer" }}
                                            primary="Reservations"/>
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        {/* Nowy element Ratings */}
                                        <ListItemText
                                        onClick={() => navigate('/account/ratings')}
                                        sx={{ cursor: "pointer" }}
                                        primary="Ratings"
                                        />
                                    </ListItem>
                                    <Divider/>
                                    <ListItem>
                                        <ListItemText primary="More options..."/>
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid2>

                        <Grid2 size={{md: 9, sm: 12, xs: 12}}>
                            <Grid2 sx={{bgcolor: "background.paper",borderColor:"textSecondary", borderRadius: 2, padding: 4}}>
                                <Typography variant="body2" color="textSecondary" mb={4}>
                                    Manage your personal information, name and email and account.
                                </Typography>
                                <Grid2 container spacing={2} columns={12}>
                                    <Grid2 size={{md: 6, sm: 12, xs: 12}}>
                                        <Card sx={{bgcolor:"background.default"}} variant="outlined">
                                            <CardContent>
                                                <Typography variant="body2" color="textSecondary">
                                                    FullName
                                                </Typography>
                                                <Typography variant="h6">
                                                    {user?.firstName} {user?.lastName}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                    <Grid2 size={{md: 6, sm: 12, xs: 12}}>
                                        <Card sx={{bgcolor:"background.default"}} variant="outlined">
                                            <CardContent>
                                                <Typography variant="body2" color="textSecondary">
                                                    Role
                                                </Typography>
                                                <Typography variant="h6">
                                                    {user?.perissionLevel == 2
                                                        ? "Admin"
                                                        : user?.perissionLevel == 1
                                                            ? "Worker"
                                                            : "User"}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                    <Grid2 size={{md: 6, sm: 12, xs: 12}}>
                                        <Card sx={{bgcolor:"background.default"}} variant="outlined">
                                            <CardContent>
                                                <Typography variant="body2" color="textSecondary">
                                                    Email
                                                </Typography>
                                                <Typography variant="h6">{user?.email}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                </Grid2>

                            </Grid2>
                            <Grid2 size={{md: 12, sm: 12, xs: 12}}>
                                <Box sx={{
                                    bgcolor: "background.paper",
                                    borderColor: '#f5f5f5', borderRadius: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mt: 2,
                                    p: 2,
                                }}>
                                    <Typography variant="h5" fontWeight="bold">Delete Account</Typography>
                                    <Button variant="contained" color="error"
                                            onClick={() => remove(user)}>
                                        Delete
                                    </Button>
                                </Box>
                            </Grid2>
                        </Grid2>

                    </Grid2>
                </Box>
            </Container>
        </div>

    );
};

export default Account