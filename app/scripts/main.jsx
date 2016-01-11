'use strict';

// $.getJSON( 'world-countries/countries.json', function( data ) {
//   var items = [];
//   $.each( data, function( key, val ) {
//     items.push( "<li id='" + key + "'>" + val + "</li>" );
//   });
 
//   $( "<ul/>", {
//     "class": "my-new-list",
//     html: items.join( "" )
//   }).appendTo( "body" );
// });


var FilterRegionsSection = React.createClass({
	// getInitialState: function() {
	// 	var continents = {Europe: {
	// 					   "IT": {name: "Italy", "demonym": "Italian", income: 50000},
	// 					   "HR": {name: "Croatia", "demonym": "Croatian", income: 46000}
	// 					   }
	// 					  };
	// 	return {continents: continents, selectedRegionCode: "IT"};
	//  },

	handleChange: function(e) {
		this.props.callbackParent(e.target.value);
	},
	render: function() {
		var options = [];
		//need to generate dynmically options and then add them
		return (
			<div className="world-chart-col">
			  <label> Continents</label>
			  <select className="form-control">
			    <option>Europe</option>
			    <option>Africa</option>
			  </select>
			  <label> Subregion</label>
			  <select className="form-control">
			    <option> None </option>
			    <option selected>Western Europe</option>
			    <option>Eastern Europe</option>
			  </select>
			  <label>Countries</label>
			  <select onChange={this.handleChange} className="form-control countries-select">
			    <option value="IT">Italy</option>
			    <option value="HR">Croatia</option>
			    <option value="BY">Belarus</option>
			    <option value="RU">Russia</option>
			  </select>

			  <div id="world-map" className="col-md-6 map">
			  </div>
			</div>
		);
	}
});

var RegionChart = React.createClass({
	render: function() {
		return (
			<div className="chart-info">
			  <h1> {this.props.country.demonym} American Household Income</h1>
			  <p> Average: {accounting.formatMoney(this.props.country.income)} </p>
			  <div className="ct-chart ct-perfect-fourth"></div>
			</div> 
		)
	}
});


var Container = React.createClass({
	getInitialState: function() {
		var continents = {Europe: {
						   "IT": {name: "Italy", "demonym": "Italian", income: 50000},
						   "HR": {name: "Croatia", "demonym": "Croatian", income: 46000}
						   }
						  };
		var countries = {
						"IT": {name: "Italy", "demonym": "Italian", income: 50000},
						"HR": {name: "Croatia", "demonym": "Croatian", income: 46000}
						};

		return {continents: continents, selectedRegionCode: "HR", countries: countries};
	 },

	handleChange: function(e) {
		this.setState({selectedRegionCode: e.target.value});
	},
	onChildChanged: function(value){
		this.setState({selectedRegionCode: value});
	},
	render: function() {
		console.log("this.state.selectedRegionCode", this.state.selectedRegionCode, this.state.countries[this.state.selectedRegionCode]);
		return (
		    <div className="container">
		      <div className="row marketing">
		        <div> <h1> U.S. Household Income by National Origin</h1></div>
		        <div id="filter-regions" className="col-md-6">
		        <FilterRegionsSection callbackParent={this.onChildChanged} />
		        </div>

		        <div id="region-chart" className="col-md-6">
		        	<RegionChart country={this.state.countries[this.state.selectedRegionCode]}/>
		        </div> 
		      </div>
		     </div>
		    );

	}
});

ReactDOM.render(
  <Container/>,
  document.getElementById('app')
);




$('document').ready(function() {

	var initialColor = '#B8E186',
		selectedColor = '#3e9d01';

	$('#world-map').vectorMap({map: 'world_mill_en', 
		backgroundColor: 'white',
		regionStyle: {
	      initial: {
	        fill: '#B8E186'
	      },
	      selected: {
	        fill: '#F4A582'
	      }
	    },
		series: {
			regions: [{
				attribute: 'fill',
				color: 'pink'
			}]
		}
		});

	var regions = [];
	var mapObject = $('#world-map').vectorMap('get', 'mapObject');

	var selectedValue;

	   mapObject.series.regions[0].setValues({
         'IT': '#3e9d01'
	   });




	   $('.countries-select').on('change', function() {
	   	var countryCode = $('.countries-select').val();
	   	console.log("selected Value", selectedValue);
	   	if (!selectedValue) {
	   		selectedValue = 'IT';
	   	}
    	   	var revertValues = {};
    	   	revertValues[selectedValue]=initialColor;    	   		


	   	mapObject.series.regions[0].setValues(revertValues);

	   	selectedValue = countryCode;
	   	var colorValues = {};
	   	colorValues[countryCode]=selectedColor;

	   	mapObject.series.regions[0].setValues(colorValues);

	   });
});


var data = {
// A labels array that can contain any sort of values
labels: ['General American', 'Italian American', 'W. European American', 'European American'],
// Our series array that contains series objects or in this case series data arrays
series: [
[50000, 50000, 40000, 45000]
]
};

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
var myChart = new Chartist.Bar('.ct-chart', data);

$("body").on("click", function() {
	var labels = ['General American'];

	var newData = {
	// A labels array that can contain any sort of values
	labels: ['General American', 'Croatian American', 'W. European American', 'European American'],
	// Our series array that contains series objects or in this case series data arrays
	series: [
	[60000, 70000, 80000, 90000]
	]
	};

	myChart.update(newData);
})
