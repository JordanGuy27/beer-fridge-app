import React from 'react';
import ReactDOM from 'react-dom';
import Event from './eventPost'

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

class App extends React.Component {
    constructor() {
      super();
      this.state = {
        event: '',
        beer: '',
        events: [],
        loggedIn: false,
        user: {},
        userText: ''
      }
      this.addEvent = this.addEvent.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addBeer = this.addBeer.bind(this);
      this.removeBeer = this.removeBeer.bind(this);
      this.closeEvent = this.closeEvent.bind(this);
      this.signIn = this.signIn.bind(this);
      this.signOut = this.signOut.bind(this);
      this.scroll = this.scroll.bind(this);
    }
    componentDidMount() {
      
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

      firebase.auth().onAuthStateChanged((res) => {
        if(res) {
          this.setState({
            loggedIn: true,
            user: res
          })
        } else {
          this.setState({
            loggedIn: false,
            user: {}
          })
        }
        ReactDOM.findDOMNode(this).scrollIntoView();
      });
      
    }
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'select_account'
      })

      firebase.auth().signInWithPopup(provider)
        .then((user) => {
          console.log(user)
        })
    }
    signOut() {
      console.log('woo');
      firebase.auth().signOut();
    }
    handleChange(e) {
      this.setState({
        [e.target.id]: e.target.value
      });
    }
    addEvent(e) {
      e.preventDefault();
      const event = {
        eventName: this.state.event,
        beer: this.state.beer
      }

      if (this.state.event === '' || this.state.beer === '') {
        alert('Please enter an event AND amount of beer')
      } else {
        const newEvent = Array.from(this.state.events);
        
        newEvent.push(event);
  
        console.log(newEvent);
  
        this.setState({
          events: newEvent,
          event: '',
          beer: ''
        })    
  
        const dbRef = firebase.database().ref();
        dbRef.push(event); 
      }
      $('html').animate({
        scrollTop: $('.eventNotesContainer').offset().top
      });
    }
    scroll(e) {
      e.preventDefault();
      document.querySelector('.addEvent').scrollIntoView({
        behavior: 'smooth'
      });
    }
    addBeer(event) {
      const beerEvent = Object.assign({},event);

      beerEvent.beer  = Number(beerEvent.beer) + 1;
      const dbref = firebase.database().ref(beerEvent.key);

      delete beerEvent.key;

      dbref.set(beerEvent);
    }
    removeBeer(event) {
      const beerEvent = Object.assign({}, event);

      beerEvent.beer = Number(beerEvent.beer) - 1;

      const dbref = firebase.database().ref(beerEvent.key);

      delete beerEvent.key;

      dbref.set(beerEvent);
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
                    <div className="headerContainer">
                    {this.state.loggedIn ?
                        <div className="headerTrue">
                          <h1>Welcome, {this.state.user.displayName}</h1>
                          <h3>You're ready to console.log some beers</h3>
                          <button onClick={this.signOut} className="upper ">Sign Out</button>
                          <button className="upper" onClick={this.scroll}>Add Event</button> 
                        </div>
                          :
                        <div className="headerFalse">       
                          <h1>Cerveza P.I.</h1>
                          <h3>Tracking your cold ones since 2018</h3>
                          <button onClick={this.signIn} className="upper">Sign In</button>
                        </div>
                      }
                    </div>
              </div>
          </header>
          <div className="wrapper">
            <aside className="sidebar">
              <div>
                <h3 className="addEvent">Add New Event</h3>
              </div>
              <form onSubmit={this.addEvent} className="eventForm">
                <label htmlFor="event" >Enter Event:</label>
                <input type="text" value={this.state.event} id="event" onChange={this.handleChange} />
                <label htmlFor="beer">How many beers are available?</label>
                <input type="text" value={this.state.beer} id="beer" onChange={this.handleChange} />
                <input type="submit" value="Submit" className="submit"/>
              </form>
            </aside>
            <section>
             <div className="eventNotesContainer">
                {this.state.events.map((event, i) => {
                  return (
                    <Event data={event} key={i} removeBeer = {this.removeBeer}
                    closeEvent={this.closeEvent} addBeer={this.addBeer}/>
                  )
                })}
             </div>
            </section>
          </div>
        </div>
      )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
