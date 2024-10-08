import React from 'react'

import { AxiosInstance } from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import MarkdownLatex from './MarkdownLatex'

import ICard from '../../types/Card';

interface ICardEditPreviewProps {
    client: AxiosInstance,
    getDeck: (newCardId?: number) => void,
    card: ICard,
    activeCardId: number,
    setActiveCardId: React.Dispatch<React.SetStateAction<number>>,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
    handleCardUpdate: () => boolean
}

export default function CardEditPreview({ client, getDeck, card, activeCardId, setActiveCardId, setEditing, handleCardUpdate }: ICardEditPreviewProps) {


    function handleErrorResponse(error: any): string {
        if (!error.response.data.error) {
            return "Error inesperado"
        }

        return error.response.data.error
    }


    function handleCardDeletion(e: React.MouseEvent<SVGElement, MouseEvent>) {

        e.stopPropagation();

        const id = toast.loading("Eliminando");

        client.post("/delete_card",
        {
            card_id: card.card_id
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }

        }).then((response) => {
            toast.update(id, 
                { 
                render: "Tarjeta eliminada", 
                type: "info", 
                isLoading: false,
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            getDeck();
            setActiveCardId(response.data.new_card_id);

        }).catch((error) => {
           
            toast.update(id, 
            { 
                render: handleErrorResponse(error), 
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

    function handleCardClick() {
        if (activeCardId === card.card_id) {
            return;
        }
        
        if (handleCardUpdate()) {
            setActiveCardId(card.card_id);
            setEditing(true);
        }
        
        
    }

    function handleLongQuestion(question: string,  maxLength: number = 30): string {
        // Get number of # at the start of the string
        let numHashes = (question.substring(0, 4).match(/#/g) || []).length; 
        
        // Provide a formula that would provide an appropiate max length based on the number of hashes
        
        maxLength = maxLength / (1 + ((3 - numHashes) / 5));

        return question.length > maxLength ? question.substring(0, maxLength) + '...' : question
    }
    
    return (
        <div className={`border secondary card-edit-preview place-center pointer ${activeCardId === card.card_id ? "shadow-primary" : "shadow-secondary"}`} onClick={() => handleCardClick()}>
            <p><MarkdownLatex content={card.question ? handleLongQuestion(card.question) : 'Nueva tarjeta'}/></p>

            <FontAwesomeIcon icon={faTrashCan} size='lg' className='pointer delete-card' onClick={(e) => handleCardDeletion(e)}/>
            
        </div>
    )
}
