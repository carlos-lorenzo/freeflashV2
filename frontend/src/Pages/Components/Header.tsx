import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faArrowLeftLong, faArrowRightToBracket, faHouse } from '@fortawesome/free-solid-svg-icons';

import Logout from './Logout';

import IUser from '../../types/User';

interface IHeaderProps {
    client: AxiosInstance,
    user: IUser,
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    showBack: boolean,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>
}


export default function Header({ client, user, setUser, showBack, setShowBack }: IHeaderProps) {

    
    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

    function profileClickLink(): string {

        if (user.loggedIn) {
            return '/home';
        } else {
            return '/login';
        }
    }


    function handleBack() {
        setShowBack(false);
    }

    return (
        <nav id="header">
            {
                showBack ?
                <Link to={profileClickLink()} className='pointer' id='back' onClick={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeftLong} size='2x'/>
                </Link> : null
            }
            
            
            <Link to={"/"} className='pointer'>
                <h1>Free Flash</h1>
            </Link>

            <div className="hamburger-menu">

                <label className="hamburger">
                    <input type="checkbox" onClick={() => setShowHamburgerMenu(!showHamburgerMenu)} checked={showHamburgerMenu}></input>
                    <svg viewBox="0 0 32 32">
                        <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                        <path className="line" d="M7 16 27 16"></path>
                    </svg>
                </label>

                {
                    showHamburgerMenu ? 
                    <div className="hamburger-options border">
                        {
                            user.loggedIn ?
                            <Link to={'/home'} className='pointer hamburger-option' onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}>
                                <FontAwesomeIcon icon={faHouse} size='lg'/>
                                <p>Cards</p>
                            </Link> : null
                        }
                        

                        {
                            user.loggedIn ?
                            <Link to={'/profile'} className='pointer hamburger-option' onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}>
                                <FontAwesomeIcon icon={faGear} size='lg'/>
                                <p>Profile</p>
                            </Link> : null
                        }
                        

                        <div id='login-logout' onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}>
                            {
                                user.loggedIn ?
                                <Logout client={client} setUser={setUser} setBack={setShowBack}/> :
                                <Link to={'/login'} className='pointer hamburger-option'>
                                    <FontAwesomeIcon icon={faArrowRightToBracket} size='lg'/>
                                    <p>Login</p>
                                </Link>
                            }
                        </div>
                    </div> : null
                }   

            </div>
            
        </nav>
    )
}
