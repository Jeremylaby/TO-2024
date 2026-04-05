import {
    Box,
    Card,
    CardContent,
    Grid,
    Container,
    Typography,
    Divider,
    ThemeProvider,
    createTheme,
    CssBaseline,
    useMediaQuery
  } from "@mui/material";
  import Avatar from "@mui/material/Avatar";
  import NavBar from "../components/NavBar.jsx";
  import { useAuth } from "../components/AuthProvider.jsx";
  import { useNavigate } from "react-router-dom";
  import { useMemo } from "react";
  
  const Admin = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
    const theme = useMemo(
      () =>
        createTheme({
          palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            background: {
              default: prefersDarkMode ? '#121212' : '#f5f5f5',
              paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
            },
            primary: {
              main: '#90caf9',
            },
            text: {
              primary: prefersDarkMode ? '#ffffff' : '#000000',
              secondary: prefersDarkMode ? '#b0b0b0' : '#666666',
            },
          },
        }),
      [prefersDarkMode],
    );
  
    const adminLinks = [
      { title: "Zarządzanie użytkownikami", path: "/admin/users", description: "Przeglądaj i zarządzaj kontami użytkowników" },
      { title: "Panel filmów", path: "/admin/movie-panel", description: "Dodawaj i edytuj filmy w systemie" },
      { title: "Panel seansów", path: "/admin/seans-panel", description: "Zarządzaj harmonogramem seansów" },
      { title: "Panel sal", path: "/admin/room-panel", description: "Konfiguruj i zarządzaj salami kinowymi" },
      { title: "Analityka", path: "/analytics", description: "Przeglądaj statystyki i raporty" },
    ];
  
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={"d-flex flex-column"}>
          <NavBar />
          <Container>
            <Box sx={{ padding: 4, minHeight: "100vh" }}>
              <Card 
                sx={{ 
                  mb: 4,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <div>
                      <Typography variant="h4" color="text.primary">
                        Witaj, Adminie!
                      </Typography>
                    </div>
                  </Box>
                  <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
                  <Grid container spacing={3}>
                    {adminLinks.map((link) => (
                      <Grid item xs={12} sm={6} md={4} key={link.path}>
                        <Card 
                          sx={{ 
                            height: '100%', 
                            cursor: 'pointer',
                            backgroundColor: 'action.selected',
                          }}
                          onClick={() => navigate(link.path)}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom color="text.primary">
                              {link.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {link.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </div>
      </ThemeProvider>
    );
  };
  
  export default Admin;