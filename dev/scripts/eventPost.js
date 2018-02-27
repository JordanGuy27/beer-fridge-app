import React from 'react';

const Event = (props) => {
    return (
        <div className="eventNotes">
            <h4>{props.data.eventName}</h4>
            <p>
                There are currently {props.data.beer} beers left at this event
            </p>
            <div className="buttonContainer">
                <button className="drinkBeer" onClick={() => props.removeBeer(props.data)}>Drink Beer</button>
                <button className="addBeer" onClick={() => props.addBeer(props.data)}>Add Beer</button>
                <button className="leaveEvent" onClick={() => props.closeEvent(props.data.key)}>Leave Event</button>
            </div>
        </div>
    )
}

export default Event;