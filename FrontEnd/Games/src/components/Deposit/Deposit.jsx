import React ,{ useState, Backdrop } from "react";
import { Modal , Box , Fade }from "@mui/material"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Deposit(){
    const [open, setOpen] = useState(true)
    const [amounta, setAmounta] = useState(0);
    const navigate = useNavigate();
    const style = {
        width: '470px',
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

    const handleChange = (e) => {
      const value = e.target.value;
      if (!isNaN(value) && value.trim() !== '') {
            setAmounta(parseInt(value));
          } else {
          setAmounta(0);
      }
  };

    function handleClose(){
        setOpen(false);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('amount', amounta);
        
        const response = await axios.post(`http://localhost:1010/auth/wallet/deposit`, formData, {
          amount: formData.get('amount'),
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        })

        if (response.status === 200) {
          alert("Deposit was successful!");
          navigate('/bank');
      } else {
          alert("Something went wrong! Try again later!");
      }
      }
      catch (error){
          alert("Something went wrong during deposit! Try again later!" , error);
          console.error(error);
      }
    }

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
                <h2 className="text-xl">Deposit!</h2>
                  <form onSubmit={handleSubmit}>
                    <select name="DepositAmount" id="depositamount" onChange={(e) => setAmounta(parseInt(e.target.value))}>
                        <option value="1000">1000</option>
                        <option value="2500">2500</option>
                        <option value="5000">5000</option>
                    </select>
                    <input type="text" name="dep" id="dep" onChange={handleChange} placeholder="Enter amount" />

                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Deposit</button>
                    <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => navigate('/bank')}>Cancel</button>
                  </form> 

                  
              </Box>
            </Fade> 
          </Modal>
          
        </>
    )
}

export default Deposit;