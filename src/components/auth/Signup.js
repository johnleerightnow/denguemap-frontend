import React, { useState, useContext, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Navigate, useNavigate } from "react-router-dom";
import apiservices from "../../services/apiservices";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
// eslint-disable-next-line import/no-cycle
import { LoginContext } from "../../App";
import { emailValidateRegex } from "../helpers/utility";

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {"Copyright © "}
      <Link color='inherit' href={process.env.REACT_APP_COPYRIGHT_URL}>
        DengueMap
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const theme = createTheme();

const GOOGLE_MAPS_API_KEY = "AIzaSyBa_goqnYBs-H6HFzGKGIuiWpuBexWyMcI";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const SignUp = () => {
  const navigate = useNavigate();
  const [loggedIn] = useContext(LoginContext);

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  });
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [error, setFormError] = useState({});
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [redirect, setRedirect] = useState(false);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (window && window.google) {
      loaded.current = true;
    } else if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        request.componentRestrictions = { country: "sg" };
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validateInput = async (inputs) => {
    let errors = {};
    if (!inputs.name) {
      errors.name = "Name must not be empty";
    }
    if (!value) {
      errors.address = "Address must not be empty";
    }
    if (!inputs.password) {
      errors.password = "Password must not be empty";
    } else if (inputs.password.length < 5) {
      errors.password = "Password must not be less than 5 characters";
    }
    if (!inputs.email) {
      errors.email = "Email must not be empty";
    } else if (!emailValidateRegex.test(inputs.email)) {
      errors.email = "Please key in a valid email format";
    } else {
      await apiservices.checkemail(formValues).then((response) => {
        if (response && response.data.msg === "Email already exists") {
          errors.email = response.data.msg;
        }
      });
    }
    // console.log("errors", errors);
    setFormError(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await validateInput(formValues);
    // console.log("error", error);
    // console.log("result", result);
    // if (Object.keys(error).length === 0) not working

    if (result) {
      geocodeByAddress(value.description)
        .then((results) => getLatLng(results[0]))
        .then((result2) => {
          let finalResult = {
            ...formValues,
            address: value.description,
            fulladdress: value,
            latLng: result2,
          };
          apiservices.signup(finalResult);
          setRedirect(true);
        });
    }
  };

  if (redirect) {
    return <Navigate replace to='/signin' />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            {/* <LockOutlinedIcon /> */}
            <AccountBoxIcon />
          </Avatar>
          <Typography component='h1' variant='h6'>
            Sign up for dengue cluster notifications
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container justifyContent='center' spacing={2}>
              <Grid item xs={11}>
                <TextField
                  values={formValues.name}
                  onChange={handleInputChange}
                  autoComplete='given-name'
                  name='name'
                  required
                  fullWidth
                  id='name'
                  label='Name'
                  helperText={error.name}
                  autoFocus
                />
              </Grid>
              <Grid item xs={11}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  value={formValues.email}
                  label='Email'
                  onChange={handleInputChange}
                  name='email'
                  helperText={error.email}
                  autoComplete='email'
                />
              </Grid>
              <Grid item xs={11}>
                <TextField
                  required
                  fullWidth
                  values={formValues.password}
                  onChange={handleInputChange}
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                />
              </Grid>
              <p>{error.password}</p>
              <Grid item xs={11}>
                <Autocomplete
                  id='google-map-demo'
                  sx={11}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.description
                  }
                  filterOptions={(x) => x}
                  options={options}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  value={value}
                  noOptionsText='No locations'
                  onChange={(event, newValue) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    // console.log("onChange", newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    // console.log("onInputchange,newInputValue", newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} required label='Address' fullWidth />
                  )}
                  renderOption={(props, option) => {
                    const matches =
                      option.structured_formatting
                        .main_text_matched_substrings || [];

                    const parts = parse(
                      option.structured_formatting.main_text,
                      matches.map((match) => [
                        match.offset,
                        match.offset + match.length,
                      ])
                    );

                    return (
                      <li {...props}>
                        <Grid container alignItems='center'>
                          <Grid item sx={{ display: "flex", width: 44 }}>
                            <LocationOnIcon sx={{ color: "text.secondary" }} />
                          </Grid>
                          <Grid
                            item
                            sx={{
                              width: "calc(100% - 44px)",
                              wordWrap: "break-word",
                            }}
                          >
                            {parts.map((part, index) => (
                              <Box
                                key={index}
                                component='span'
                                sx={{
                                  fontWeight: part.highlight
                                    ? "bold"
                                    : "regular",
                                }}
                              >
                                {part.text}
                              </Box>
                            ))}

                            <Typography variant='body2' color='text.secondary'>
                              {option.structured_formatting.secondary_text}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                    );
                  }}
                />
              </Grid>

              <p>{error.address}</p>
              <Grid item xs={11}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>

            <Grid container justifyContent='center'>
              <Grid item>
                <Link href='/signin' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
