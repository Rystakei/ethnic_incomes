'use strict';

var sortedCountries = {},
	subRegions = {},
	regions = {},
	unavailableCountries = [];

function setDefaultColors(value) {
	if (!value){
		var value = '#D2D7D3';
	}
	var defaultColors = {};
	unavailableCountries.forEach((function(countryCode){
		defaultColors[countryCode]=value;
	}));
	return defaultColors;
}

function addToAreaIncomes(areaList, area, income) {
	if (areaList[area]) {
		areaList[area].incomes.push(income);
	}
	else {
		areaList[area]={incomes: [income]};
	}
}

function calculateAreaAverage(area) {
	$.each(area, function(key, area) {
		area.averageIncome = getAverage(area.incomes);
	});
}

function getAverage(arr){
	var sum = _.reduce(arr, function(a,b) {
		return a + b;
	});
	return (sum / arr.length).toFixed(2);
}

Countries.forEach((function(country) {
	if (Incomes[country.cca2]) {
		country.income = Incomes[country.cca2].income;

		sortedCountries[country.cca2]=country;

		addToAreaIncomes(subRegions, country.subregion, country.income);
		addToAreaIncomes(regions, country.region, country.income);
	}
	else {
		unavailableCountries.push(country.cca2);
	}
}));


calculateAreaAverage(subRegions);
calculateAreaAverage(regions);

//end processing


var FilterRegionsSection = React.createClass({
	getInitialState: function(e) {
		return { value: ''};
	},
	handleChange: function(e) {
		var value = e.value,
			that = this;
		this.setState({value: e.value}, function() {
			that.props.callbackParent(e.value);
		});
	},

	handleChildUpdate: function(value){
		this.setState({value: value}, function() {
			this.props.callbackParent(value);
		});
	},

	render: function() {
		var options = [];
		$.each(this.props.countries, function(key, country) {
			options.push({value: country.cca2, label: country.name.common});
		});


		return (
			<div className="world-chart-col">
			  <label>Countries</label>
			  <Select
			      value={this.state.value}
			      options={options}
			      onChange={this.handleChange}
			  />
        	  <WorldMap callbackParent={this.handleChildUpdate} countryCode={this.state.value}></WorldMap>
			</div>
		);
	}
});


var IncomeGraph = React.createClass({
	render: function() {
		var country = this.props.country,
	        regionLabel = "" + country.demonym + " American",
		    data = {
	        		labels: ['General American',
	                     regionLabel,
	                     country.subregion + ' American',
	                     country.region + ' American'],
	        		series: [
	        			       [50000,
	        			        country.income,
	        			        subRegions[country.subregion].averageIncome,
	        			        regions[country.region].averageIncome
	        			       ]
	        		        ]
	        	},

		    type = 'Bar';
		return (
			<ChartistGraph data={data} type={type} />
		);
}
});

var RegionChart = React.createClass({
	render: function() {
		return (
			<div className="chart-info">
			  <h1> {this.props.country.demonym} American Household Income</h1>
			  <p> Average: {accounting.formatMoney(this.props.country.income)} </p>
			  <div className="ct-chart ct-perfect-fourth">
			  	<IncomeGraph country={this.props.country}></IncomeGraph>
			  </div>
			</div> 
		)
	}
});


var mapObject;

var WorldMap = React.createClass({
  getInitialState: function() {
  	// var initialColor = '#B8E186',
   //      oldSelectedColor = '#3e9d01',
   //      selectedColor = '#26C281',
   //      colorValues = setDefaultColors();

   //base: 76B36D

        return {selectedColor: '#43803A',
        		initialColor: '#A9E6A0'
        	   };
  },

  componentDidMount: function() {
    var that = this;

    $(ReactDOM.findDOMNode(this.refs.WorldVectorMap)).vectorMap({
      map: 'world_mill_en', 
      backgroundColor: 'white',
      regionStyle: {
          initial: {
            fill: that.state.initialColor
          }
        },
      series: {
        regions: [{
          attribute: 'fill',
          color: 'pink'
        }]
      },
      onRegionOver: function(e, code) {
      	if (unavailableCountries.indexOf(code) === -1) {
      		document.body.style.cursor = 'pointer';
      	}
      },

      onRegionOut: function(e, code) {
      	document.body.style.cursor = 'default';
      },
      onRegionClick: function(e, code) {
      	if (unavailableCountries.indexOf(code) === -1) {
      		that.props.callbackParent(code);
      	}
      } 
    });

    mapObject = $('#world-map').vectorMap('get', 'mapObject');
    this.resetMapColors();
  },

  resetMapColors: function(region) {
  	var colorValues = setDefaultColors();
  		if (region) {
		  	colorValues[region]=this.state.selectedColor;  	
  		}
  		mapObject.reset();
	  	mapObject.series.regions[0].setValues(colorValues);
  },

  componentWillUpdate: function() {
  	this.resetMapColors(this.props.countryCode);
  },

  render: function() {
    return (<div id="world-map" className="col-md-6 map" 
    		ref="WorldVectorMap"></div>);
  }
});


var Container = React.createClass({
	getInitialState: function() {
		return {selectedRegionCode: "HR", countries: sortedCountries};
	 },

	handleChange: function(e) {
		this.setState({selectedRegionCode: e.target.value});
	},
	onChildChanged: function(value){
		this.setState({selectedRegionCode: value});
	},
	render: function() {
		return (
		    <div className="container">
		      <div className="row marketing">
		        <div> <h1> U.S. Household Income by National Origin</h1></div>
		        <div id="filter-regions" className="col-md-6">
		        	<FilterRegionsSection countries={this.state.countries} 
		        		callbackParent={this.onChildChanged} />
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



