import React from 'react';
import './Logo.css';
import Tilt from 'react-tilt'
import brain from './brain.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max: 55 }} 
				style={{ height: 150, width: 150, display: 'flex', alignItems: 'center', 
					justifyContent: 'center' }} >
				<div className="Tilt-inner pa3"> 
					<img  style={{ width: '100px', height: '100px' }} src={brain} 
						alt='logo'/>
				</div>
			</Tilt>
		</div>
	)
}

export default Logo;