import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain-96.png';
import './Logo.css'

const Logo = () => {
    return (
        <div style={{width: '200px', paddingLeft: '25px'}}> 
            <Tilt className='br2 shadow-2 Tilt' >
                <img style={{paddingTop: '5px'}} src={brain} alt='logo'></img>
            </Tilt>
        </div>
    );
}

export default Logo;