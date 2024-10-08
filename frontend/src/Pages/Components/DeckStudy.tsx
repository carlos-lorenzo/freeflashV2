import { useState, useEffect, useRef } from 'react'

import { AxiosInstance } from 'axios'
import MarkdownLatex from './MarkdownLatex'

import ICard from '../../types/Card';
import IDeck from '../../types/Deck';

declare interface IDeckStudyProps {
    client: AxiosInstance
    activeDeck: IDeck
} 

export default function DeckStudy({ client, activeDeck }: IDeckStudyProps) {
    enum Confidences {
        NONE = 0,
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3
    }

    interface IContent {
        content: string,
        questionShown: boolean
    }

    const [content, setContent] = useState<IContent>({
        content: "",
        questionShown: true
    });

   
    const [card, setCard] = useState<ICard | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [submittedConfidence, setSubmittedConfidence] = useState<Confidences>(Confidences.NONE);

    const studyContainerRef = useRef<HTMLDivElement>(null);

    function handleSwap() {
        if (!card) {
            return;
        }

        if (content.questionShown) {
            setContent({
                content: card.answer,
                questionShown: false
            })
        } else {
            setContent({
                content: card.question,
                questionShown: true
            })
        }
    }

    function handleConfidenceUpdate(confidence: Confidences) {

        if (!card) {
            return;
        }
        setSubmittedConfidence(confidence);
        setIsAnimating(true);

        client.post(
            "/update_confidence",
            {
                card_id: card.card_id,
                confidence: confidence
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((_response) => {
            getCard();
            
            setTimeout(() => {
                setIsAnimating(false)
            }, 1000);
            
            

            

        })
    }

    function getCard() {
        client.get(
            `/fetch_deck_card?deck_id=${activeDeck.deck_id}`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
        ).then((response) => {
            setCard(response.data.card);
            setContent({
                content: response.data.card.question,
                questionShown: true
            });
            
        })
    }

    useEffect(() => {
        studyContainerRef.current?.focus();
        getCard();


    }, [])


    function getConfidenceClassName(confidence?: number): string {
        if (confidence === undefined) {
            return "none";
        }

        switch (confidence) {
            case Confidences.LOW:
                return "accent";
            case Confidences.MEDIUM:
                return "primary";
            case Confidences.HIGH:
                return "green";
            default:
                return "none";
        }
    }

    function handleShortcuts(event: any) {
        event.preventDefault();
        if (event.key === " ") {
            handleSwap();
        } else if(event.key === "1") {
            handleConfidenceUpdate(Confidences.LOW);
        } else if(event.key === "2") {
            handleConfidenceUpdate(Confidences.MEDIUM);
        } else if(event.key === "3") {
            handleConfidenceUpdate(Confidences.HIGH);
        }
    }


        

    return (
        <div id='study' className='fill place-center' onKeyDown={handleShortcuts} tabIndex={0} ref={studyContainerRef}>
            <div id="study-content" className={`text card border fill shadow-secondary overlay ${content.questionShown ? "place-center" : ""} ${isAnimating ? `animate-confidence animate-${getConfidenceClassName(submittedConfidence)}` : ''}`} onClick={() => handleSwap()}>

                
                {
                    content.questionShown && !isAnimating ? 
                    <div id="confidence-marker" className={`shadow-${getConfidenceClassName(card?.confidence)} border ${getConfidenceClassName(card?.confidence)}-bg`}></div>
                    : null
                }
                
                <MarkdownLatex content={content.content}/>
                
            </div>
            <div id='study-options' className='fill'>   
                <button className='shadow-secondary border secondary-bg study-option' onClick={handleSwap}>Girar</button>
                <button className='shadow-accent border accent-bg study-option' onClick={() => handleConfidenceUpdate(Confidences.LOW)}>BAJA</button>
                <button className='shadow-primary border primary-bg study-option' onClick={() => handleConfidenceUpdate(Confidences.MEDIUM)}>MEDIANA</button>
                <button className='shadow-green border green-bg study-option' onClick={() => handleConfidenceUpdate(Confidences.HIGH)}>ALTA</button>
            </div>
            
        </div>
    )
}

