import React, { useState, useContext, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import apiservices from "../../services/apiservices";
// import { withCookies } from "react-cookie";
import moment from "moment";
import { LoginContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {"Copyright © "}
      <Link color='inherit' href='https://mui.com/'>
        DengueMap
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

function SignInSide(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({});
  const [loggedIn] = useContext(LoginContext);
  const cookies = new Cookies();

  useEffect(() => {
    if (loggedIn) {
      return navigate("/");
    }
  });

  const validateForm = async () => {
    let errors = {};
    if (!email) {
      errors.email = "Email must not be empty";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = "Please key in a valid email format";
    }
    if (!password) {
      errors.password = "Password must not be empty";
    } else if (password.length < 5) {
      errors.password = "Password must have more than 5 characters";
    }
    setFormError(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valid = await validateForm();
    if (valid) {
      let errors = {};
      try {
        const dataToVerify = { email: email, password: password };
        const response = await apiservices.signin(dataToVerify);
        console.log(response);
        if (!response.data.success) {
          errors.general = response.data.msg;
          setFormError(errors);
          return;
        }
        if (response.data.success) {
          console.log(response.data);
          cookies.set("token", response.data.token, {
            path: "/",
            expires: moment.unix(response.data.expiresAt).toDate(),
          });
          window.location.href = "/";
        }
      } catch (err) {
        errors.general = "Something went wrong";
        setFormError(errors);
        console.log("Error", err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component='main' sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?mosquito)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign in
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                values={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p>{formError.email}</p>
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                values={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>{formError.password}</p>
              <p>{formError.general}</p>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href='#' variant='body2'>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href='#' variant='body2'>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;
