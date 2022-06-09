import React ,{ useState } from 'react'
import logout_img from '../img/logout_img.png'

const Logout = ({setMask}) => {
  const [logoutSign , setLogoutSign] = useState('logout_close')
    const handleLogout =()=>{
        localStorage.clear()
        window.location.href ='./'
    }

  return (
    <div>
        <img src={logout_img} alt="logout" className='logout_img' onClick={()=>{
          setLogoutSign('logout_sign')
          setMask('mask')
          }}/>
        <div className={logoutSign}>
          <p>Do you want to leave the Game ?</p>
          <div className='button_controll'>
            <button onClick={handleLogout}>yes</button>
            <button onClick={()=>{
              setLogoutSign('notification_close')
              setMask('mask-closed')
            }}>no</button>
          </div>
        </div>
    </div>
  )
}

export default Logout