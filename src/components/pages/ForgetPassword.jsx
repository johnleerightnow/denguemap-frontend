import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import apiservices from "../../services/apiservices";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log(email);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiservices.forgetpassword({ email });
    setMsg("If email exist, reset link will be sent");
  };
  return (
    <>
      <Typography
        style={{ marginTop: 40 }}
        gutterBottom
        variant='h4'
        align='center'
      >
        Reset Password
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Typography gutterBottom variant='h6'>
              Lost your password? Please enter your email address. You will
              receive a link to create a new password via email.
            </Typography>
            <form noValidate={true} onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid xs={12} item>
                  <TextField
                    placeholder='Email'
                    label='Email'
                    name='email'
                    variant='outlined'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <p>{msg}</p>
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

export default ForgetPassword;
