'use strict';

var FilterRegionsSection = React.createClass({
	getInitialState: function(e) {
		return { value: 'HR'};
	},
	handleChange: function(e) {
		this.setState({value: e.target.value}, function() {
			this.props.callbackParent(e.target.value);
		});
	},
	render: function() {
		var options = [];

		$.each(this.props.countries, function(key, country) {
			options.push(<option key={country.code} value={country.code}>{country.name}</option>);
		});

		return (
			<div className="world-chart-col">
			  <label>Countries</label>
			  <select onChange={this.handleChange} value={this.state.value} className="form-control countries-select">
			  {options}
			  </select>

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
                         'W. European American',
                         'European American'],
            		series: [
            			       [50000, country.income, 55000, 45000]
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

    $(React.findDOMNode(this.refs.WorldVectorMap)).vectorMap({map: 'world_mill_en', 
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
		var countries = {
						"IT": {name: "Italy", code: "IT", "demonym": "Italian", income: 50000},
						"HR": {name: "Croatia", code: "HR", "demonym": "Croatian", income: 46000}
						};

		return {selectedRegionCode: "HR", countries: countries};
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



