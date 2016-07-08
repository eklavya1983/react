import React from 'react';
import ReactDOM from 'react-dom'

const ListItem = ({styles, data}) => {
	console.log(data);
	let photoUrl = '';
	if (data.photos !== 'undefined' && data.photos.length > 0) {
		photoUrl = data.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
	}
	let boxStyle = {
		border: "1px solid #ddd",
		borderRadius: "4px",
		padding: "5px",
		margin: "5px"
	}
	return (
		<div className="listitem" style={boxStyle}>
			<div>
				<img src={photoUrl} witdh="100" height="100"/>
			</div>
			<div>
				{data.formatted_address}
			</div>
		</div>
	);
}

class SearchList extends React.Component {
	render() {
		const {results} = this.props;
		const {flex} = this.props.styles;
		console.log("SearchList:results");
		console.log(results);
		return (
			<div style={{flex:flex, overflow: "auto"}}>
				{results.map((r, index) => <ListItem key={index} data={r} />)}
			</div>
		);
	}
}

// From: http://revelry.co/google-maps-react-component-in-es6/
class GMap extends React.Component {
	constructor() {
		super();
		this.state = { zoom: 10 };
	}

	static propTypes() {
		initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
	}

	render() {
		const {flex} = this.props.styles;
		const styles = {
			searchBox: {
				backgroundColor: "#fff",
				fontFamily: "Roboto",
				fontSize: "15px",
				fontWeight: 300,
				marginLeft: "12px",
				padding: "0 11px 0 13px",
				textOverflow: "ellipsis",
				width: "300px",
				marginTop: "10px",
				border: "1px solid transparent",
				borderRadius: "2px 0 0 2px",
				boxSizing: "border-box",
				height: "32px",
				outline: "none",
				boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"
			}
		}
		console.log("render");
		return (
			<div id="GMapC" style={{flex:flex}}>
				<input id="pac-input" ref="searchBox" style={styles.searchBox} type="text" placeholder="Search Box"/>
				<div id="mapcanvas" ref="mapCanvas" style={{height:"100%"}}> </div>
			</div>
		);
	}

	componentDidMount() {
		console.log("componentDidMount");
		// create the map, marker and infoWindow after the component has
		// been rendered because we need to manipulate the DOM for Google =(
		this.map = this.createMap()
		// this.marker = this.createMarker()
		// this.infoWindow = this.createInfoWindow()
		this.searchBox = this.createSearchBox()
		this.map.addListener('bounds_changed', () => {
			this.searchBox.setBounds(this.map.getBounds());
		});
		this.markers = [];
		this.infowindow = new google.maps.InfoWindow();
		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		this.searchBox.addListener('places_changed', () => {
			var places = this.searchBox.getPlaces();

			if (places.length == 0) {
				return;
			}

			// Clear out the old markers.
			this.markers.forEach((marker) => {
				marker.setMap(null);
			});
			this.markers = [];

			// For each place, get the icon, name and location.
			var bounds = new google.maps.LatLngBounds();
			places.forEach((place) => {
				var icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};

				// Create a marker for each place.
				const marker = new google.maps.Marker({
					map: this.map,
					icon: icon,
					title: place.name,
					position: place.geometry.location
				})
				this.markers.push(marker);
				google.maps.event.addListener(marker, 'click', () => {
					this.infowindow.setContent(place.name);
					this.infowindow.open(this.map, marker);
				});


				if (place.geometry.viewport) {
					// Only geocodes have viewport.
					bounds.union(place.geometry.viewport);
				} else {
					bounds.extend(place.geometry.location);
				}
			});
			this.map.fitBounds(bounds);
			this.props.searchResultCb(places);
		});

		// have to define google maps event listeners here too
		// because we can't add listeners on the map until its created
		google.maps.event.addListener(this.map, 'zoom_changed',
			() => this.handleZoomChange())
	}

	// clean up event listeners when component unmounts
	componentDidUnMount() {
		console.log("componentDidUnMount");
		google.maps.event.clearListeners(map, 'zoom_changed')
	}

	createMap() {
		let mapOptions = {
			zoom: this.state.zoom,
			center: this.mapCenter()
		}
		return new google.maps.Map(this.refs.mapCanvas, mapOptions)
	}

	mapCenter() {
		return new google.maps.LatLng(
			this.props.initialCenter.lat,
			this.props.initialCenter.lng
		)
	}

	createSearchBox() {
		console.log("createSearchBox");
		const sb = new google.maps.places.SearchBox(this.refs.searchBox)
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.refs.searchBox);
		return sb;
	}


	handleZoomChange() {
		console.log("handleZoomChange");
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			results: []
		}
	}
	searchResultCb(results) {
		console.log("App:searchResultCb");
		console.log(results);
		this.setState({results: results});
	}
	render() {
		const {initialCenter} = this.props;
		return (
			<div style={{display:"flex", flex:1}}>
				<GMap styles={{flex:2}} initialCenter={initialCenter}
					searchResultCb={(results)=>this.searchResultCb(results)}>
				</GMap>
				<SearchList styles={{flex:1}} results={this.state.results}/>
			</div>
		);
	}
}

function geolocate() {
	if (false && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			// this.searchBox.setBounds(circle.getBounds());
			// this.map.panTo(geolocation);
			ReactDOM.render(<App initialCenter={geolocation} />, document.getElementById('container'));
		});
	} else {
		var initialCenter = { lng: -121.965395, lat: 37.511033}
		ReactDOM.render(<App initialCenter={initialCenter} />, document.getElementById('container'));
	}
}
geolocate();

