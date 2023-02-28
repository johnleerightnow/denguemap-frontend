import React from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import apiservices from "../../services/apiservices";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [formValues, setFormValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const validateInput = () => {
    let err = {};
    if (!formValues.password) {
      err.password = "Password must not be empty";
    } else if (formValues.password.length < 5) {
      err.password = "Password must not be less than 5 characters";
    }
    if (!formValues.confirmpassword) {
      err.confirmpassword = "Confirm password must not be empty";
    } else if (formValues.confirmpassword.length < 5) {
      err.confirmpassword =
        "Confirm password must not be less than 5 characters";
    } else if (formValues.password !== formValues.confirmpassword) {
      err.confirmpassword = "Password and confirm password is not the same";
    }
    setErrors(err);
    if (Object.keys(err).length !== 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validateInput();
    if (valid) {
      const userId = searchParams.get("id");
      const token = searchParams.get("token");
      console.log();
      apiservices
        .resetpassword({
          userId,
          token,
          password: formValues.password,
        })
        .then((res) => {
          console.log("res", res);
          if (res.data.success) {
            setSuccess({ message: res.data.message });
            setTimeout(() => navigate("/signin"), 1200);
          }
        })
        .catch((err) => {
          console.log("error", err);
          setErrors({ reply: err.response.data.error });
        });
    }
  };
  return (
    <>
      <Typography gutterBottom variant='h4' align='center'>
        Reset Password
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Typography gutterBottom variant='h6'>
              Please key in your new password
            </Typography>
            <form noValidate={true} onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid xs={12} item>
                  <TextField
                    autoFocus
                    margin='dense'
                    id='password'
                    label='Password'
                    type='password'
                    fullWidth
                    variant='standard'
                    name='password'
                    value={formValues.password}
                    onChange={handleInputChange}
                  />
                  <p>{errors.password}</p>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin='dense'
                    id='confirmpassword'
                    label='Confirm Password'
                    type='password'
                    fullWidth
                    variant='standard'
                    name='confirmpassword'
                    value={formValues.confirmpassword}
                    onChange={handleInputChange}
                  />
                  <p>{success.message}</p>
                  <p>{errors.confirmpassword}</p>
                  <p>{errors.reply}</p>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ResetPassword;
