import React, { useState}from "react";
import { Modal , Button , Box , FormControl , InputLabel, OutlinedInput , InputAdornment , IconButton , TextField , Fade }from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';

function PasswordChange(){
    //előző jelszó lekérése és a név alapján az id megkeresése 
    
    const [open, setOpen] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
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
        width: '400px',
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

    const fetchUser = async (name) => {
        try {
            const response = await axios.get(`http://localhost:1010/admin/get-all-users`);
            const users = response.data.data;
            console.log(users)
            const user = users.find(user => user.name === name);
            return user ? user.id : null;
        } catch (error) {
            alert("User not found!");
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const userId = await fetchUser(username)

        if(userId){
            try {
                const response = await axios.put(`http://localhost:1010/admin/update/${userId}`, {
                    password: password,
                });
                alert("Password succesfully changed! Login with the new password!")
                navigate('/sign_in');
    
            } catch (error) {
                alert("There was an error changing password! Passwords are not the same!");
            }
        }
    };
    return(
        <>
            <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
                <Fade in={open} timeout={2000}>
                    <Box sx={style}>
                        <h2>Change Password</h2>
                        <form onSubmit={handleSubmit}>
                            <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => {setUsername(e.target.value)}} required/>
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                                <InputLabel htmlFor="new-password" required>New Password</InputLabel>
                                <OutlinedInput
                                    id="new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                                <InputLabel htmlFor="confirm-password" required>Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setPasswordHelp(e.target.value)}
                                    required
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '44ch' }}>            
                                <Box sx={style2}>
                                    <Button type="submit" variant="contained" color="primary">Change Password</Button>
                                    <Link to="/sign_in">
                                        <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
                                    </Link>
                                </Box>
                            </FormControl>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default PasswordChange;

