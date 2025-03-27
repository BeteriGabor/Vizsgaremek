import React, { useState}from "react";
import { Modal , Button , Box , FormControl , InputLabel, OutlinedInput , InputAdornment , IconButton , TextField , Fade }from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link , useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

function Register(){
        const [open, setOpen] = useState(true)
        const [showPassword, setShowPassword] = useState(false)
        const handleClickShowPassword = () => setShowPassword((show) => !show);
        const [email, setEmail] = useState("");
        const [username, setUsername] = useState("")
        const [password, setPassword] = useState("")
        const [birthDate, setBirthDate] = useState(null)
        const [emailError, setEmailError] = useState("");
        const [passwordHelp , setPasswordHelp] = useState("")

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
            width: '470px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 48,
            p: 4,
            borderRadius: '8px'
        };
    
        const style2 = {
          display: 'flex',
          justifyContent: 'space-between'
        }

        const style3 = {
          color: 'black'
        }

        const handleSubmit = async (event) => {
          event.preventDefault(); 
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          
          if (password !== passwordHelp) {
              alert("Passwords are not the same!");
          } else if (!emailPattern.test(email)) {
              alert("Your email is incorrect!");
              setEmailError("Your email is incorrect!");
          } else {
              try {
                  const response = await axios.post('http://localhost:1010/auth/register', {
                    username: username,
                    email: email,
                    password: password,
                    role: 'user', 
                    birthDate: dayjs(birthDate).format("YYYY-MM-DD"),
                  });
      
                  alert(response.data.message)
                  navigate('/sign_in');
      
              } catch (error) {
                  console.error("There was an error registering!", error);
                  alert("Registration failed! Please try again.");
              }
          }
      };

    return(
        <Modal className="bg-defbg" open={open} onClose={handleClose} disableEscapeKeyDown BackdropProps={{
                timeout: 2500,
            }}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Fade in={open} timeout={2000}>
            <Box sx={style}>
              <h2>Register!</h2>
               <form onSubmit={handleSubmit}>
               <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined" >
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => {setUsername(e.target.value)}} required/>
              </FormControl>
  
              <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-basic" required>Password</InputLabel>
                <OutlinedInput
                    id="outlined-basic"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => {setPassword(e.target.value)}}
                    endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
                }
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-basic" required>Password again</InputLabel>
                <OutlinedInput
                    id="outlined-basic"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => {
                        setPasswordHelp(e.target.value)
                    }}
                    endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
                }
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            views={['year', 'month', 'day']}
                            minDate={dayjs().subtract(500, "years")}
                            maxDate={dayjs().subtract(18, "years")}
                            showDisabledMonthNavigation
                            sx={{ width: '48ch' }}
                            onChange={(newValue) => {
                                const formattedDate = newValue.format("YYYY-MM-DD");
                                setBirthDate(formattedDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </FormControl>

            <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                    <TextField
                        required
                        label="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        error={emailError}
                        helperText={emailError ? "Please enter a valid email" : ""}
                        inputProps={{
                        type: "email",
                        }}
                        autoComplete="off"
                        />
                    </FormControl>
            
                    <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                        <Box sx={style2}>
                            <Button variant="contained" type="submit" color="success">Register</Button>
                            <Link to="/sign_in">
                                <Button variant="contained" type="submit" color="secondary">Back to Login page!</Button>
                            </Link>
                        </Box>         
                        <p style={style3}>Be careful! The more you play the more chance you will become an addict!</p>
                    </FormControl>
               </form>
            </Box>
            </Fade>
          </Modal>
    )
}

export default Register;