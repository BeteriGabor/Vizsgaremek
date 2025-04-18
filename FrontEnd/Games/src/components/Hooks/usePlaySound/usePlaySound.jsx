import { useSound } from 'use-sound'; 
import coinSound from '../../assets/sounds/coin.wav'; 
import winSound from '../../assets/sounds/win.mp3'; 
import loseSound from '../../assets/sounds/lose.mp3'; 

const usePlaySound = () => {
  const [playCoin] = useSound(coinSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  return { playCoin, playWin, playLose };
};

export default usePlaySound;