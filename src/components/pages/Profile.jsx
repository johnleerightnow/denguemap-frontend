import React, { useState, useContext, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
import Cookies from "universal-cookie";
// eslint-disable-next-line import/no-cycle
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import { LoginContext } from "../../App";
import apiservices from "../../services/apiservices";
import ChangePassword from "../ChangePass";
import moment from "moment";
import { emailValidateRegex } from "../helpers/utility";

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

export default function Profile() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [loggedIn] = useContext(LoginContext);
  const initialValues = {
    name: "",
    email: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [error, setFormError] = useState({});
  const [value, setValue] = React.useState(null);
  //1.null
  //2.api call - put in full value
  //3.useEffect runs, compare previous and current
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [redirect, setRedirect] = useState(false);
  const loaded = React.useRef(false);
  const [emailNotify, setEmailNotify] = React.useState(true);
  const [dbValues, setDbValues] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

  const enableIfUserChanged = () => {
    /* Api call has successfully returned the fromValues */
    if (dbValues) {
      /* User made a change */
      console.log("{ dbValues, formValues }", { dbValues, formValues });
      if (
        JSON.stringify({
          name: dbValues.name,
          email: dbValues.email,
          emailNotify: dbValues.emailnotification,
          fulladdress: dbValues.fulladdress,
        }) !==
        JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          emailNotify: emailNotify,
          fulladdress: value,
        })
      ) {
        setDisabled(false);
      } else {
        /* User did not change anything */
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  };

  if (typeof window !== "undefined" && !loaded.current) {
    if (window && window.google) {
      loaded.current = true;
    } else if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`,
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

  useEffect(() => {
    enableIfUserChanged();
  }, [formValues, value, emailNotify]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/signin");
    }
    if (loggedIn) {
      apiservices.userprofile({ token }).then((result) => {
        const { email, name, fulladdress, emailnotification } = result.data;
        setDbValues({
          email,
          name,
          fulladdress,
          emailnotification,
        });

        setFormValues({
          email,
          name,
        });
        setValue(fulladdress);
        setEmailNotify(emailnotification);
      });
    }
  }, []);

  useEffect(() => {
    console.log(formValues);
    console.log("inputValue", inputValue);
    console.log("value", value);
  }, [value, formValues, inputValue]);

  const validateInput = async (inputs) => {
    const errors = {};
    if (!inputs.name) {
      errors.name = "Name must not be empty";
    }
    if (!value) {
      errors.address = "Address must not be empty";
    }
    if (!inputs.email) {
      errors.email = "Email must not be empty";
    } else if (!emailValidateRegex.test(inputs.email)) {
      errors.email = "Please key in a valid email format";
    } else {
      if (dbValues.email !== formValues.email) {
        await apiservices.checkemail(formValues).then((response) => {
          if (response && response.data.msg === "Email already exists") {
            errors.email = response.data.msg;
          }
        });
      }
    }
    setFormError(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
  };

  const handleSwitchChange = (event) => {
    setEmailNotify(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = await validateInput(formValues);
    if (valid) {
      geocodeByAddress(value.description)
        .then((results) => getLatLng(results[0]))
        .then((result2) => {
          const finalResult = {
            ...formValues,
            address: value.description,
            latLng: `${result2.lat},${result2.lng}`,
            fulladdress: value,
            emailNotification: emailNotify,
          };
          apiservices.updateprofile(token, finalResult).then((response) => {
            console.log(response);
            if (response.data.success) {
              console.log(response.data);
              cookies.remove("token");
              cookies.set("token", response.data.token, {
                path: "/",
                expires: moment.unix(response.data.expiresAt).toDate(),
              });
            }
          });
          setRedirect(true);
        });
    }
  };

  if (redirect) {
    return <Navigate replace to='/' />;
  }
  // function usePrevious(value) {
  //   const ref = useRef();
  //   useEffect(() => {
  //     ref.current = value;
  //   });
  //   return ref.current;
  // }
  // const previousValue = usePrevious(checked);

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Profile
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='name'
                  value={formValues.name}
                  label='Name'
                  onChange={handleInputChange}
                  name='name'
                  autoComplete='given-name'
                />
              </Grid>
              <p>{error.name}</p>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  value={formValues.email}
                  label='Email'
                  onChange={handleInputChange}
                  name='email'
                  autoComplete='email'
                />
              </Grid>
              <p>{error.email}</p>

              <Grid item xs={12}>
                <Autocomplete
                  id='google-map-demo'
                  sx={{ width: "25rem" }}
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
              <Grid item xs={12}>
                <ChangePassword />
              </Grid>
              <p>{error.password}</p>
              <Grid item xs={12}>
                <Stack direction='row' spacing={1} alignItems='center'>
                  <Typography>Dengue Cluster Notifications</Typography>
                  <Switch
                    checked={emailNotify}
                    onChange={handleSwitchChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={disabled}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
