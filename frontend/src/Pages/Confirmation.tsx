import React from 'react';


import { AxiosInstance } from 'axios';


import RegisterConfirmation from './Components/RegisterConfirmation';

interface IConfirmationProps {
    client: AxiosInstance
}

export default function Confirmation({ client }: IConfirmationProps) {

    const getType = (): string | null => new URLSearchParams(window.location.search).get('type')
    
    return (
        getType() === "activate" ? <RegisterConfirmation client={client} /> : (
            <div id="confirmation-page" className="fill place-center">
                <h2>Invalid Link</h2>
            </div>
        )
    )
}
