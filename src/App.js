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
import Clarifai from 'clarifai';

const app = new Clarifai.App({
	apiKey: '3cef5a94d13c4154b832c103a90da8ec'
});

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

class App extends Component {
	
	constructor() {
		super();
		this.state = {
			input: '',
			imageURL: '',
			box: {},
			route: 'signin',
			isSignedIn: false
		}
	}
	
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
			this.setState({isSignedIn: false})
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
		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL,
				this.state.input)
			.then(response => this.calculateFaceLocation(response))
			.then(box => this.displayFaceBox(box))
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
						<Rank />
						<ImageLinkForm 
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}/>
						<FaceRecognition box={box} imageURL={imageURL}/>
					</div>
					: (
						route === 'signin' 
						? <Signin onRouteChange={this.onRouteChange}/>
						: <Register onRouteChange={this.onRouteChange}/> // register
					)
				}
			</div>
		);
	}
}

export default App;
