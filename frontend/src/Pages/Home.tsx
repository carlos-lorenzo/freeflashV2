import React, {useEffect, useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { AxiosInstance } from 'axios';

import Courses from './Components/Courses';
import Decks from './Components/Decks';

import IUser from '../types/User';
import ICourse from '../types/ICourse';
import IBriefDeck from '../types/BriefDeck';


enum DeckAction {
    PREIVEW = 'PREIVEW',
    EDIT = 'EDIT',
    STUDY = 'STUDY',
}

interface IHome {
    client: AxiosInstance,
    user: IUser,
    activeCourseId: number | undefined,
    setActiveCourseId: React.Dispatch<React.SetStateAction<number | undefined>>,
    activeDeckId: number | undefined,
    setActiveDeckId: React.Dispatch<React.SetStateAction<number | undefined>>,
    setDeckAction: React.Dispatch<React.SetStateAction<DeckAction>>,
    setShowBack: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Home({ 
    client, 
    user,
    activeCourseId,
    setActiveCourseId,
    activeDeckId,
    setActiveDeckId,
    setDeckAction,
    setShowBack

}: IHome) {

    const navigate = useNavigate();

    const [courses, setCourses] = useState<ICourse[]>([]);
    const [decks, setDecks] = useState<IBriefDeck[]>([]);
    const [activeCourseName, setActiveCourseName] = useState<string>('');

    function getCourseDecks(course_id: number | undefined) {
        if (course_id === undefined) {
            return;
        }
        client.get(`/course_decks?course_id=${course_id}`,
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }
        ).then((response) => {
            setDecks(response.data.decks);
        });
    }

    function getCourses() {
        client.get("/get_courses",
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            
            if (!response.data) {
                setCourses([]);
                setDecks([]);
                setActiveCourseId(undefined);
                
            } else {
                if (activeCourseId === undefined) {
                    setActiveCourseId(response.data.courses[0].course_id);
                    
                }
                setCourses(response.data.courses);
                getCourseDecks(activeCourseId);
                setActiveCourseName(response.data.courses[0].name);
            }

            
        })
    }
    
    useEffect(() => {
        if(!user.loggedIn) {
            navigate('/login');
        }
        
        getCourses();
        
    }, [])
    

	return (
		<div id='user-view' className='fill'>
            <div className='whitespace'></div>
            <Courses
                client={client}
                courses={courses}
                getCourses={getCourses}
                getCourseDecks={getCourseDecks}
                setActiveCourseId={setActiveCourseId}
                setActiveCourseName={setActiveCourseName}
            />

            <Decks
                client={client}
                activeCourseId={activeCourseId}
                decks={decks}
                setActiveDeckId={setActiveDeckId}
                getCourseDecks={getCourseDecks}
                setDeckAction={setDeckAction}
                activeCourseName={activeCourseName}
                setShowBack={setShowBack}
            />
            <div className='whitespace'></div>

        </div>
	)
}
