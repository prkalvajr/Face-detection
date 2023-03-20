import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    console.log('click');
  }

  render() {
  const {input} = this.state;
    return (
    <div className="App">
      <ParticlesBg className='particles' num={200} type="tadpole" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={this.onInputChange} 
                     onButtonSubmit={this.onButtonSubmit} />
      { /*
      <FaceRecognition /> */}
    </div>
  )};
}

export default App;
