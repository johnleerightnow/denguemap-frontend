import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Button from "@mui/material/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Popover from "@mui/material/Popover";
import "../index.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API;

const descriptionHighRisk = (
  <span>
    High-risk area with 10 or more cases - <span>Red.</span>
  </span>
);
const descriptionMedRisk = (
  <span>
    Med-risk area with less than 10 cases - <span>Yellow</span>
  </span>
);

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

function SearchBar(props) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const loaded = React.useRef(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

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

  const submitData = () => {
    const newErrors = {};
    if (!value) {
      newErrors.location = "Please input location.";
    }
    setErrors(newErrors);
    if (value) {
      const address = value.description;
      geocodeByAddress(address)
        .then((results) => getLatLng(results[0]))
        .then((res) => {
          props.newaddress({
            latLng: `${res.lat},${res.lng}`,
            frontlatlng: res,
            obj: {
              latLng: `${res.lat},${res.lng}`,
              riskArea: "High",
              location: address,
            },
          });
        })
        .catch((err) => console.log("err", err));
    }
  };

  return (
    <>
      <Autocomplete
        id='google-map-demo'
        sx={{ width: 300 }}
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
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            helperText={errors.location}
            {...params}
            label='Add a location'
            fullWidth
          />
        )}
        renderOption={(props1, option) => {
          const matches =
            option.structured_formatting.main_text_matched_substrings || [];

          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match) => [match.offset, match.offset + match.length])
          );

          return (
            <li {...props1}>
              <Grid container alignItems='center'>
                <Grid item sx={{ display: "flex", width: 44 }}>
                  <LocationOnIcon sx={{ color: "text.secondary" }} />
                </Grid>
                <Grid
                  item
                  sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
                >
                  {parts.map((part, index) => (
                    <Box
                      key={index}
                      component='span'
                      sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
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

      <div style={{ position: "relative" }}>
        <Button
          variant='contained'
          onClick={submitData}
          style={{ marginTop: "16px", width: "30%" }}
          className='submitButton'
        >
          Submit
        </Button>
        <InfoOutlinedIcon
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup='true'
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          className='outlineIcon'
          style={{
            width: "30%",
            position: "absolute",
            top: "20px",
            left: "100px",
          }}
        />
        <Popover
          id='mouse-over-popover'
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>
            {descriptionHighRisk}
            <br />
            {descriptionMedRisk}
          </Typography>
        </Popover>
      </div>
    </>
  );
}

export default SearchBar;
