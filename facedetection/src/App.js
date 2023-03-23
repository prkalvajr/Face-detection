import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css';
import { Component } from 'react';

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'a3a9f91a10514e22a3d30c9f36838a17';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'prkalva';       
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';    
const IMAGE_URL = 'https://images.newscientist.com/wp-content/uploads/2022/02/14174128/PRI_223554170.jpg?crop=4:3,smart&width=1200&height=900&upscale=true';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const obj = JSON.parse(data);
    const clarifaiFace = obj.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box})
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": this.state.input
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.text())
      .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    this.setState({route: route});
    if(route === 'signout')
      this.setState({isSignedIn: false});
    else if (route === 'home')
      this.setState({isSignedIn: true});
  }

  render() { 
    const { isSignedIn, box, imageUrl, route } = this.state;
    return (
    <div className="App">
      <ParticlesBg className='particles' num={200} type="tadpole" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {route === 'home' 
      ? <div> 
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={this.onInputChange} 
                   onButtonSubmit={this.onButtonSubmit} />
      <FaceRecognition box={box} imageUrl={imageUrl} />
    </div>     
      : ( route === 'signin') 
      ? <SignIn onRouteChange={this.onRouteChange} />
      : <Register onRouteChange={this.onRouteChange} />
      }
    </div>
  )};
}

export default App;
