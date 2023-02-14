import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import apiservices from "../../services/apiservices";

function ContactForm() {
  const [formValues, setFormValues] = useState({});
  const [errors, setFormErrors] = useState({});
  const [sent, setSent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = (inputs) => {
    let errors = {};
    if (!inputs.name) {
      errors.name = "Name must not be empty";
    }
    if (!inputs.email) {
      errors.email = "Email must not be empty";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputs.email)
    ) {
      errors.email = "Please key in a valid email format";
    }
    // if (!inputs.subject) {
    //   errors.subject = "Subject must not be empty";
    // } else if (!inputs.subject.length > 100) {
    //   errors.subject = "Subject must not be more than 100 characters";
    // }
    if (!inputs.message) {
      errors.message = "Message must not be empty";
    } else if (!inputs.message.length > 1000) {
      errors.message = "Message must not be more than 1000 characters";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm(formValues);
    if (valid) {
      const returnmsg = await apiservices.contactform(formValues);
      if (returnmsg && returnmsg.data.status === "success") {
        setSent("success");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setFormErrors({ general: "Something went wrong please try again" });
      }
    }
  };
  return sent !== "success" ? (
    <div style={{ marginTop: 40 }} className='ContactForm'>
      <Typography gutterBottom variant='h4' align='center'>
        Contact Form
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Typography gutterBottom variant='h6'>
              Send your request here. <br />
              Alternatively you may email to contact@denguemap.sg
            </Typography>
            <form noValidate={true} onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid xs={12} item>
                  <TextField
                    placeholder='Name'
                    label='Name'
                    name='name'
                    variant='outlined'
                    onChange={handleInputChange}
                    fullWidth
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type='email'
                    placeholder='Enter email'
                    label='Email'
                    variant='outlined'
                    name='email'
                    onChange={handleInputChange}
                    fullWidth
                    helperText={errors.email}
                    required
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    placeholder='Enter Subject'
                    label='Subject'
                    variant='outlined'
                    name='subject'
                    value={formValues.subject}
                    onChange={handleInputChange}
                    helperText={errors.subject}
                    fullWidth
                    required
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    label='Message'
                    multiline
                    rows={4}
                    placeholder='Type your message here'
                    variant='outlined'
                    name='message'
                    value={formValues.message}
                    onChange={handleInputChange}
                    helperText={errors.message}
                    fullWidth
                    required
                  />
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
                <p>{errors.general}</p>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  ) : (
    <div style={{ marginTop: 40 }} className='ContactForm'>
      <Typography gutterBottom variant='h4' align='center'>
        Contact Form
      </Typography>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Typography gutterBottom variant='h6'>
              Form successfully sent.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default ContactForm;
