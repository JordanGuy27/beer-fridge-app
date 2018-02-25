import React from 'react';
import ReactDOM from 'react-dom';
import Event from './eventPost'


class App extends React.Component {
    constructor() {
      super();
      this.state = {
        event: '',
        beer: '',
        events: []
      }
      this.addEvent = this.addEvent.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.showSidebar = this.showSidebar.bind(this);
      this.addBeer = this.addBeer.bind(this);
      this.removeBeer = this.removeBeer.bind(this);
      this.closeEvent = this.closeEvent.bind(this);
    }
    componentDidMount() {
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDshEk755XVbpEE7Lkw_a7sbAQQzXT2RBs",
        authDomain: "beer-fridge-app.firebaseapp.com",
        databaseURL: "https://beer-fridge-app.firebaseio.com",
        projectId: "beer-fridge-app",
        storageBucket: "",
        messagingSenderId: "488699414285"
      };
      firebase.initializeApp(config);
      
      const dbRef = firebase.database().ref();

      dbRef.on('value', (snapshot) => {
        const eventsData = snapshot.val();
        const eventsArray = [];

        for( let event in eventsData) {
          eventsData[event].key = event;
          eventsArray.push(eventsData[event]);
        }

        this.setState ({
          events: eventsArray
        });

      });

    }
    handleChange(e) {
      this.setState({
        [e.target.id]: e.target.value
      });
    }
    showSidebar(s) {
      s.preventDefault();
   
    }
    addEvent(e) {
      e.preventDefault();
      const event = {
        eventName: this.state.event,
        beer: this.state.beer
      }

      const newEvent = Array.from(this.state.events);
      
      newEvent.push(event);

      console.log(newEvent);

      this.setState({
        events: newEvent,
        event: '',
        beer: ''
      })    

      const dbRef = firebase.database().ref();
      dbRef.push(newEvent);
    }
    addBeer() {
      console.log('works');
    }
    removeBeer() {
      console.log('removing');
    }
    closeEvent(leave) {
      console.log(leave);
      const dbRef = firebase.database().ref(leave);
      dbRef.remove();
    }
    render() {
      return (
        <div>
          <header>
            <div className="wrapper">
                <h1>Beer Tracker</h1>
                <h3>Keep track of your cold ones</h3>
                <nav>
                <button href="#" onClick={this.showSidebar}>Add Event!</button>
                <button>Login</button>
                </nav>
            </div>
          </header>
            <div className="wrapper">
              <aside className="sidebar">
                <form onSubmit={this.addEvent} className="eventForm">
                  <h3>Add New Event</h3>
                  <div className="exitBtn">
                    {/* input an image for closing window */}
                  </div>
                  <label htmlFor="event" >Enter Event:</label>
                  <input type="text" value={this.state.event} id="event" onChange={this.handleChange} />
                  <label htmlFor="beer">How many beers are available?</label>
                  <input type="text" value={this.state.beer} id="beer" onChange={this.handleChange} />
                  <input type="submit" value="submit" className="submit"/>
                </form>
              </aside>
              <section className="eventNotes">
                {this.state.events.map((event, i) => {
                  return (
                    <Event data={event} key={i} removeBeer = {this.removeBeer}
                    closeEvent={this.closeEvent} addBeer={this.addBeer}/>
                  )
                })}
              </section>
          </div>
        </div>
      )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
