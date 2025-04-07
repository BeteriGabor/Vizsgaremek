import React ,{ useState, Backdrop } from "react";
import { Modal , Box , Fade }from "@mui/material"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Deposit(){
    const [open, setOpen] = useState(true)
    const [amount, setAmount] = useState(0);
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

    function handleClose(){
        setOpen(false);
    }

    const handleSubmit = () => {
        try {
           // await axios.post('http://localhost:1010/auth/deposit')
        }
        catch (error){
            alert()
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
                <h2 className="text-xl">Deposit or withdraw your money!</h2>
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="Deposit" id="deposit" />
                    <select name="DepositAmount" id="depositamount">
                        <option value="1000">1000</option>
                        <option value="2500">2500</option>
                        <option value="5000">5000</option>
                        <input type="text" name="dep" id="dep" onChange={(e) => setAmount(e.target.value)}/>
                    </select>
                  </form> 
              </Box>
            </Fade> 
          </Modal>
          
        </>
    )
}

export default Deposit;