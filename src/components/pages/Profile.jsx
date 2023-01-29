import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
// eslint-disable-next-line import/no-cycle
import { LoginContext } from '../../App';
import apiservices from '../../services/apiservices';
import ChangePassword from "../ChangePass";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href={process.env.REACT_APP_COPYRIGHT_URL}>
        DengueMap
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

const theme = createTheme();

const GOOGLE_MAPS_API_KEY = 'AIzaSyBa_goqnYBs-H6HFzGKGIuiWpuBexWyMcI';

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export default function Profile() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get('token');
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const initialValues = {
    name: "",
    email: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [error, setFormError] = useState({});
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [redirect, setRedirect] = useState(false);
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (window && window.google) {
      loaded.current = true;
    } else if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`,
        document.querySelector('head'),
        'google-maps',
      );
    }
  }

  const fetch = React.useMemo(
    () => debounce((request, callback) => {
      request.componentRestrictions = { country: 'sg' };
      autocompleteService.current.getPlacePredictions(request, callback);
    }, 400),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
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
    if (!loggedIn) {
      return navigate('/signin');
    }
    if (loggedIn) {
      apiservices.userprofile({ token }).then((result) => {
        setFormValues({
          email: result.data.email,
          name: result.data.name,
        });
        setValue({ description: result.data.address });
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
      errors.name = 'Name must not be empty';
    }
    if (!value) {
      errors.address = 'Address must not be empty';
    }
    if (!inputs.email) {
      errors.email = 'Email must not be empty';
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputs.email)
    ) {
      errors.email = 'Please key in a valid email format';
    } else {
      await apiservices.checkemail(formValues).then((response) => {
        if (response && response.data.msg === 'Email already exists') {
          errors.email = response.data.msg;
        }
      });
    }
    // console.log("errors", errors);
    setFormError(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
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
          const finalResult = {
            ...formValues,
            address: value.description,
            latLng: result2,
          };
          apiservices.signup(finalResult);
          setRedirect(true);
        });
    }
  };

  if (redirect) {
    return <Navigate replace to="/signin" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  value={formValues.name}
                  label="Name"
                  onChange={handleInputChange}
                  name="name"
                  autoComplete="given-name"
                />
              </Grid>
              <p>{error.name}</p>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  value={formValues.email}
                  label="Email"
                  onChange={handleInputChange}
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <p>{error.email}</p>

              <Grid item xs={12}>
                <Autocomplete
                  id="google-map-demo"
                  sx={{ width: '25rem' }}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
                  filterOptions={(x) => x}
                  options={options}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  value={value}
                  noOptionsText="No locations"
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
                    <TextField {...params} required label="Address" fullWidth />
                  )}
                  renderOption={(props, option) => {
                    const matches = option.structured_formatting
                      .main_text_matched_substrings || [];

                    const parts = parse(
                      option.structured_formatting.main_text,
                      matches.map((match) => [
                        match.offset,
                        match.offset + match.length,
                      ]),
                    );

                    return (
                      <li {...props}>
                        <Grid container alignItems="center">
                          <Grid item sx={{ display: 'flex', width: 44 }}>
                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                          </Grid>
                          <Grid
                            item
                            sx={{
                              width: 'calc(100% - 44px)',
                              wordWrap: 'break-word',
                            }}
                          >
                            {parts.map((part, index) => (
                              <Box
                                key={index}
                                component="span"
                                sx={{
                                  fontWeight: part.highlight
                                    ? 'bold'
                                    : 'regular',
                                }}
                              >
                                {part.text}
                              </Box>
                            ))}

                            <Typography variant="body2" color="text.secondary">
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
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
