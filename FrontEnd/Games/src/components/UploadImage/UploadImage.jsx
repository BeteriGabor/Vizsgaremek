import React, { useState ,Backdrop } from "react";
import { Modal , Button , Box , FormControl , Fade, TextField }from "@mui/material"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadImage(){
    const [open, setOpen] = useState(true);
    const [file , setFile] = useState(null);
    const [userId , setUserId] = useState("");

    const navigate = useNavigate()

    function handleClose(){
        setOpen(false);
        navigate("/sign_in");
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

    const handleFileChange = (e) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const userIdLocalStorage = localStorage.getItem("userId");
        const formData = new FormData();
        formData.append('userId', userIdLocalStorage);
        formData.append('file', file);
        if(userIdLocalStorage === userId){
            try {
                const response = await axios.post(`http://localhost:1010/api/images/upload`, formData, {
                    file: formData.get('file'),
                });
                alert("Image uploaded successfully!");
            }
      
            catch (error) {
              alert('Error uploading image:', error);
            }
        }else{
            alert("User not found!");
        }

        
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
            className="bg-defbg"
        >
            <Fade in={open} timeout={2000}>
              <Box sx={style} >
                <h2 className="text-xl">Upload your image!</h2>
                <form onSubmit={handleSubmit}>
                    <FormControl sx={{ m: 1, width: '44ch' }}>
                        <TextField id="outlined-basic" label="User ID" variant="outlined" onChange={(e) => {setUserId(e.target.value)}} required/>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                        <input type="file" name="pic" id="picture" onChange={handleFileChange}/>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '44ch' }} variant="outlined">
                        <Box sx={style2}>
                            <Button variant="contained" type="submit" color="success" onClick={handleSubmit}>Upload</Button>
                            <Button variant="contained" color="error" onClick={handleClose}>Close</Button>
                        </Box> 
                    </FormControl>
                </form>
              </Box>
            </Fade> 
        </Modal>
        
        
        </>
    )
}

export default UploadImage;