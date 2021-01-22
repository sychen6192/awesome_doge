import React from 'react';
export default function Jumbotron({ title, description }) {
    return (

        <div className="column padding-reset">
            <div className="ui huge message page">
                <h1 className="ui huge header">{title}</h1>
                <p>{description}</p>
            </div>
        </div>

    )
}