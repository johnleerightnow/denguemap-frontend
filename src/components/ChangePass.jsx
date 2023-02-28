import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import apiservices from "../services/apiservices";
import Cookies from "universal-cookie";

export default function ChangePassword() {
  const [open, setOpen] = React.useState(false);
  const [modalValues, setModalValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalValues({
      ...modalValues,
      [name]: value,
    });
  };
  const validateInput = () => {
    let err = {};
    if (!modalValues.password) {
      err.password = "Password must not be empty";
    } else if (modalValues.password.length < 5) {
      err.password = "Password must not be less than 5 characters";
    }
    if (!modalValues.confirmpassword) {
      err.confirmpassword = "Confirm password must not be empty";
    } else if (modalValues.confirmpassword.length < 5) {
      err.confirmpassword =
        "Confirm password must not be less than 5 characters";
    } else if (modalValues.password !== modalValues.confirmpassword) {
      err.confirmpassword = "Password and confirm password is not the same";
    }
    setErrors(err);
    if (Object.keys(err).length !== 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validate = validateInput();
    if (validate) {
      const cookies = new Cookies();
      const token = cookies.get("token");
      const tokennpass = { token: token, password: modalValues.password };
      apiservices.changepassword(tokennpass).then((result) => {
        if (result.data.success) {
          setSuccess(result.data.msg);
          setTimeout(() => {
            handleClose();
            setSuccess("");
            setModalValues({});
          }, 1200);
        }
      });
    }
  };

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpen}>
        Change Password
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='password'
            label='Password'
            type='password'
            fullWidth
            variant='standard'
            name='password'
            value={modalValues.password}
            onChange={handleInputChange}
          />
          <p>{errors.password}</p>
          <TextField
            margin='dense'
            id='confirmpassword'
            label='Confirm Password'
            type='password'
            fullWidth
            variant='standard'
            name='confirmpassword'
            value={modalValues.confirmpassword}
            onChange={handleInputChange}
          />
          <p>{errors.confirmpassword}</p>
          <p>{success}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
