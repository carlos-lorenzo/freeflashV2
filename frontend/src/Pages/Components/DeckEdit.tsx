import React, {useState, useEffect} from 'react';

import { AxiosInstance } from 'axios';

import MediaQuery from 'react-responsive';

import { toast } from 'react-toastify';


import DeckEditPreview from './DeckEditPreview';
import CreateCard from './CreateCard';

import IDeck from '../../types/Deck';


interface IDeckEdit {
    client: AxiosInstance,
    activeDeck: IDeck,
    activeDeckId: number | undefined,
    activeCardId: number,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>,
    getDeck: (newCardId?: number) => void
}


export default function DeckEdit({ client, activeDeck, activeDeckId, activeCardId, setActiveCardId, getDeck }: IDeckEdit) {

    
    const [editing, setEditing] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');


    function handleCardUpdate() {
        const id = toast.loading("Guardando");
        client.post('/update_card', {
            deck_id: activeDeckId,
            question: question,
            answer: answer,
            card_id: activeCardId,
        }, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            }
        }).then(() => {
            getDeck();

            toast.update(id, 
                { 
                render: "Guardado", 
                type: "success", 
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch((error) => {
            toast.update(id, 
                { 
                render: error.response.data.error, 
                type: "error", 
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    function handleCardCreation() {
        client.post('/create_card', 
        {
            deck_id: activeDeck.deck_id,
            question: 'Nueva Pregunta',
            answer: 'Nueva Respuesta', 
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            getDeck(response.data.card.card_id);
        })

    }

    function handleShortcuts(event: any) {
        
        if (event.ctrlKey) {
            if (event.key === "s") {
                handleCardUpdate();
                event.preventDefault();
            } else if (event.key === "d") {
                handleCardCreation();
                event.preventDefault();
            }
        }
    }

    useEffect(() => {
        setQuestion(activeDeck.cards[activeCardId].question);
        setAnswer(activeDeck.cards[activeCardId].answer);
    }, [activeCardId])

    function handleDeckSwitch() {
        if (!editing) {
            return;
        }
        setEditing(!editing);
        handleCardUpdate();
    }

    return (
        <>
            <MediaQuery query='(min-width: 1281px)'>
                <div id='deck-edit' onKeyDown={handleShortcuts} tabIndex={0}>
                    <div className="whitespace"></div>
                    <DeckEditPreview 
                        client={client} 
                        activeDeck={activeDeck} 
                        getDeck={getDeck}
                        setActiveCardId={setActiveCardId}
                        handleCardUpdate={handleCardUpdate}
                        handleCardCreation={handleCardCreation}
                        setEditing={setEditing}
                    />

                    <CreateCard 
                        question={question}
                        answer={answer}
                        setQuestion={setQuestion} 
                        setAnswer={setAnswer}
                    />
                </div>
            </MediaQuery>
            <MediaQuery query='(max-width: 1280px)'>
                <div id='deck-edit' onKeyDown={handleShortcuts} tabIndex={0}>
                    <div id="edit-select">
                        <h3 className='pointer' onClick={() => handleDeckSwitch()} style={{color: editing ? 'var(--text)' : 'var(--primary)'}}>Mazo</h3>
                        <h3 className='pointer' onClick={() => setEditing(true)} style={{color: editing ? 'var(--primary)' : 'var(--text)'}}>Editar</h3>
                    </div>
                    
                    {
                        editing ? 
                        <CreateCard 
                            question={question}
                            answer={answer}
                            setQuestion={setQuestion} 
                            setAnswer={setAnswer}
                        /> : 
                        <DeckEditPreview 
                            client={client} 
                            activeDeck={activeDeck} 
                            getDeck={getDeck}
                            setActiveCardId={setActiveCardId}
                            handleCardUpdate={handleCardUpdate}
                            handleCardCreation={handleCardCreation}
                            setEditing={setEditing}
                        />
                    }
                    
                    </div>
            </MediaQuery>
        </>
       
    )
}
