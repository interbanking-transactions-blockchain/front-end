import React from "react"
import { useState } from "react"
import './TransferFunds.css'

function TransferFunds(){

    const [inputs, setInputs] = useState({
        fromAccount: '',
        toAccount: '',
        euros: ''
    });

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        alert(JSON.stringify(inputs, null, 2))

        /*
        const data = {
            fromAccount: inputs.fromAccount,
            toAccount: inputs.toAccount,
            euros: inputs.euros
        };

        // Hacer el llamado a la API usando fetch
        fetch('https://example.com/api/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Convertir los datos a JSON
        })
        .then(response => response.json())
        .then(data => {
            // Procesar la respuesta de la API
            alert('Transfer successful: ' + data.message);
        })
        .catch(error => {
            // Manejar errores
            alert('Error: ' + error.message);
        });
        */
    }

    return(
        <div className="transfer-container">
            <h2>Transfer funds</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter the account from which the funds will be withdrawn 
                <input 
                    type="text"
                    name="fromAccount"
                    value={inputs.fromAccount}
                    onChange={handleChange}
                />    
                </label> 
                <br />

                <label>Enter the account where the funds will be deposited
                <input 
                    type="text"
                    name="toAccount"
                    value={inputs.toAccount}
                    onChange={handleChange}
                />    
                </label>
                <br />

                <label>Enter the amount to transfer in EUR 
                <input 
                    type="number"
                    name="euros"
                    value={inputs.euros}
                    onChange={handleChange}
                />    
                </label>
                <br />

                <button type="submit">Transfer</button>

            </form>

        </div>
    );
}

export default TransferFunds