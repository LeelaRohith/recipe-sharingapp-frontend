import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PrimarySearchAppBar from "./Toolbar";
import { deepOrange } from "@mui/material/colors";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSnackbar } from "notistack";

import axios from "axios";

import { TailSpin } from "react-loader-spinner";
const defaultTheme = createTheme();
export default function Profile() {
  const [loading, setLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [userid, setUserid] = React.useState("");
  const [userfirstname, setUserfirstname] = React.useState("");
  const [userlastname, setUserlastname] = React.useState("");
  const [useremail, setUseremail] = React.useState("");

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editeduser = {
      id: userid,
      firstname: data.get("firstName"),
      lastname: data.get("lastName"),
      email: useremail,
    };
    console.log(editeduser);
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    try {
      const response = await axios.put(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/edit",
        editeduser,
        { headers }
      );
      console.log(response.data.text);
      //localStorage.setItem("token", response.data.text);
      setLoading(false);
      enqueueSnackbar("Profile details updated", {
        variant: "success",
        autoHideDuration: 5000,
      });
    } catch (error) {
      enqueueSnackbar("Internal Server error", {
        variant: "Error",
        autoHideDuration: 5000,
      });
      setLoading(false);
    }
  };
  const fetchData = React.useCallback(async () => {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const res = await axios.get(
      "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user",
      {
        headers,
      }
    );

    // currentuser.id=res.data.id;
    // currentuser.firstname=res.data.firstname;
    // currentuser.lastname=res.data.lastname;
    // currentuser.email=res.data.email;
    // currentuser.password=res.data.password;
    setUserid(res.data.id);
    setUserfirstname(res.data.firstname);
    setUserlastname(res.data.lastname);
    setUseremail(res.data.email);
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <FoodBankIcon></FoodBankIcon>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recipe Sharing App
          </Typography>
        </Toolbar>
      </AppBar> */}
      <PrimarySearchAppBar></PrimarySearchAppBar>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
              {userfirstname.charAt(0).toUpperCase()}
            </Avatar>
            <Typography component="h1" variant="h5">
              Profile
            </Typography>
            {useremail === "" ? null : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      disabled={true}
                      defaultValue={useremail}
                      margin="normal"
                      required
                      fullWidth
                      type="text"
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      defaultValue={userfirstname}
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      defaultValue={userlastname}
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                    />
                  </Grid>
                </Grid>
                {loading ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onSubmit={handleSubmit}
                  >
                    <TailSpin
                      visible={loading}
                      height="30"
                      width="30"
                      color="white"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onSubmit={handleSubmit}
                  >
                    SAVE CHANGES
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
}
