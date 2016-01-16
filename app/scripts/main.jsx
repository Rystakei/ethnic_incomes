'use strict';

var sortedCountries = {},
	subRegions = {},
	regions = {};

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
		console.log("average income for " + key + ":" + area.averageIncome);
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
		console.log("No income for " + country.name.common, country.cca2);
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
        	  <WorldMap countryCode={this.state.value}></WorldMap>
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
		console.log("the country", this.props.country.demonym);
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
    var options = { 
          map: 'world_mill_en', 
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
        };

        return {options: options};
  },

  componentDidMount: function() {
    var initialColor = '#B8E186',
       selectedColor = '#3e9d01',
       countryCode = this.props.countryCode;

    $(ReactDOM.findDOMNode(this.refs.WorldVectorMap)).vectorMap({map: 'world_mill_en', 
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

    mapObject = $('#world-map').vectorMap('get', 'mapObject');
  },

  componentWillUpdate: function() {
  	var colorValues = {};
	  	colorValues[this.props.countryCode]="red";  
  		mapObject.reset();
	  	mapObject.series.regions[0].setValues(colorValues);
  },

  render: function() {
    return (<div id="world-map" className="col-md-6 map" ref="WorldVectorMap"></div>);
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



