import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import Particles from 'react-particles-js';

const particlesOptions = {
	particles: {
		number: {
			value: 50,
			density: {
				enable: true,
				value_area: 800 
			}
		},
		line_linked: {
			shadow: {
				enable: true,
				color: "#3CA9D1",
				blur: 5
			}
		}	
	}
}

const initialState = {
	input: '', // what you type in the url search box
	imageURL: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	
	constructor() {
		super();
		this.state = initialState;
	}
	
	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
	}
	
	// componentDidMount() {
	// 	fetch('https://smart-brain-api.run.goorm.io')
	// 	.then(response => response.json())
	// 	.then(console.log);
	// }
	
	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}
	
	onRouteChange = (route) => {
		if (route === 'signin' || route === 'register') {
			this.setState(initialState)
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route: route});
	}
	
	displayFaceBox = (box) => {
		this.setState({box: box});
	}
	
	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}
	
	onButtonSubmit = () => {
		this.setState({imageURL: this.state.input});
		
		fetch('https://polar-refuge-06939.herokuapp.com/imageurl', {
			method: 'post',
			headers: {'Content-Type': 'application/json'}, // wrap Content-Type in quotes (hyphen)
			body: JSON.stringify({
				input: this.state.input
			})
		})
			.then(response => response.json())
			.then(response => {
				if (response) {
					fetch('https://polar-refuge-06939.herokuapp.com/image', {
						method: 'put',
						headers: {'Content-Type': 'application/json'}, // wrap Content-Type in quotes (hyphen)
						body: JSON.stringify({
							id: this.state.user.id
						})
					})
					.then(response => response.json())
					.then(count => this.setState(Object.assign(this.state.user, { entries: count })))
					// // use Object.assign since we only want to modify entries
					.catch(console.log);
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => console.log(err));
	}
	
	render() {
		const { isSignedIn, imageURL, route, box } = this.state;
		return (
			<div className="App">
				<Particles 
					className='particles'
					params={particlesOptions}
				/>
				<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
				{ route === 'home' 
					? <div> 
						<Logo />
						<Rank name={this.state.user.name} entries={this.state.user.entries} />
						<ImageLinkForm 
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}/>
						<FaceRecognition box={box} imageURL={imageURL}/>
					</div>
					: (
						route === 'signin' 
						? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
						: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> // register
					)
				}
			</div>
		);
	}
}

export default App;

// "scripts": {
    // "start": "serve -s build",
    // it used to be like this, which you can remove now:
    // "start": "react-scripts start",
// This is the recommended way to deploy to production using create react app