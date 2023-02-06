import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const About = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <>
      <Grid
        style={{ marginTop: 16 }}
        justifyContent='center'
        container
        spacing={2}
        marginTop='10'
      >
        <Grid alignItems='center' item xs={8}>
          <Typography>About Page</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>
            This website draws data from NEA and makes it easier for the user to
            search and visualise the information, it also comes with a
            notification service via email if the user signs up an account.
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>
            About the creator - he is a software engineer who likes to create
            products that people love to use and help them visualise data. If
            you have a job offer, want to collaborate to create the next grab
            app or just talk about programming, you may connect with him on{" "}
            <Link to='https://www.linkedin.com/in/john-lee-jy/'>Linkedin</Link>.
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>
            For feedback, please email to contact@denguemap.sg
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default About;
