import React, { useState ,Backdrop } from "react";
import { Modal , Button , Box , FormControl , InputLabel, OutlinedInput , InputAdornment , IconButton , TextField, Fade }from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link , useNavigate } from 'react-router-dom';
import "./Sign_in.css"


function Sign_in() {
    const [open, setOpen] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const navigate = useNavigate();

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };


    function handleClose(){
      setOpen(true);
    }

    const style = {
        width: '400px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 48,
        borderRadius: '8px', 
        p: 4,
        outline: 'none'
    };

    const style2 = {
      display: 'flex',
      justifyContent: 'center'
    }

    const handleSubmit = (event) => {
      event.preventDefault(); 

      if (username === "" || password === "") {
          alert("Please fill out the form fully and correctly!");
      } else {
          console.log(username + "\n" + password);
          navigate('http://localhost:3000')
      }

      setOpen(false)
    };

    return(
        <>
          <Modal open={open} 
          onClose={handleClose} disableEscapeKeyDown BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 2500, 
          }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
          aria-labelledby="modal-modal-title" 
          aria-describedby="modal-modal-description"
          >
            <Fade in={open} timeout={2000}>
              <Box sx={style}>
                <h1>Login to your account!</h1>
                  <form onSubmit={handleSubmit}>
                    <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                      <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => {setUsername(e.target.value)}} required/>
                    </FormControl>
  
                    <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                      <InputLabel htmlFor="outlined-basic" required>Password</InputLabel>
                        <OutlinedInput
                          id="outlined-basic"
                          type={showPassword ? 'text' : 'password'}
                          onChange={(e) => setPassword(e.target.value)}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end">
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                    </FormControl>
            
                    <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                      <Box sx={style2}>
                        <Button variant="contained" type="submit" color="success" >Login</Button>
                      </Box>
                      <p>You don't have an account?</p>
                      <Link to="/register">Click here!</Link>         
                    </FormControl>
                  </form> 
              </Box>
            </Fade> 
          </Modal>
          
        </>
    )
}

export default Sign_in;