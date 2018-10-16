import React, { Component } from 'react';
import {geolocated} from 'react-geolocated';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      lat: null,
      long: null,
      address: null,
      items: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevUserId in state so we can compare when props change.
    // Clear out any previously-loaded user data (so we don't render stale stuff).
    if (nextProps.coords !== prevState.coords) {
      return {
        myCoords: nextProps.coords,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount() {
    
    fetch("https://api.what3words.com/v2/reverse?coords=59.521251%2C-0.203586&key=DECNMYWK")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            address: result.words,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidUpdate(prevProps, prevState) {
      this._loadCoordData();
      
      if (prevProps.coords !== this.props.coords && this.props.coords !== null) {
        console.log("we got coords");
        console.log(this.props.coords.latitude.toFixed(6))
        this.setState({
          lat: this.props.coords.latitude.toFixed(6),
          long: this.props.coords.longitude.toFixed(6)
        }, function () {
          this.fetchWhat3Words();
        });
      }
  }

  fetchWhat3Words() {
    const {lat, long} = this.state;
    fetch("https://api.what3words.com/v2/reverse?coords="+lat+"%2C"+long+"&key=DECNMYWK")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.status)
          this.setState({
            isLoaded: true,
            address: result.words,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

    _loadCoordData() {
    // Cancel any in-progress requests
    // Load new data and update profileOrError
  }



  getCoordsDom() {
    return !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? <table>
            <tbody>
              <tr><td>latitude</td><td>{this.props.coords.latitude}</td></tr>
              <tr><td>longitude</td><td>{this.props.coords.longitude}</td></tr>
            </tbody>
          </table>
          : <div>Getting the location data&hellip; </div>;
  }

  render() {
    const { error, isLoaded, lat, long, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
        <p>
          {items.words}
        </p>
      <table>
      <tbody>
        <tr><td>latitude</td><td>{lat}</td></tr>
              <tr><td>long</td><td>{long}</td></tr>
            </tbody>
            </table>
        </div>
      );
    }
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
}) (MyComponent);