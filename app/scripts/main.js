// $('document').ready(function() {

//         var initialColor = '#B8E186',
//             selectedColor = '#3e9d01';

//         $('#world-map').vectorMap({map: 'world_mill_en', 
//             backgroundColor: 'white',
//             regionStyle: {
//               initial: {
//                 fill: '#B8E186'
//               },
//               selected: {
//                 fill: '#F4A582'
//               }
//             },
//             series: {
//                 regions: [{
//                     attribute: 'fill',
//                     color: 'pink'
//                 }]
//             }
//             });

//         var regions = [];
//         var mapObject = $('#world-map').vectorMap('get', 'mapObject');

//         var selectedValue;

//            mapObject.series.regions[0].setValues({
//              'IT': '#3e9d01'
//            });




//            $('.countries-select').on('change', function() {
//             var countryCode = $('.countries-select').val();
//             console.log("selected Value", selectedValue);
//             if (!selectedValue) {
//                 selectedValue = 'IT';
//             }
//                 var revertValues = {};
//                 revertValues[selectedValue]=initialColor;               
  

//             mapObject.series.regions[0].setValues(revertValues);

//             selectedValue = countryCode;
//             var colorValues = {};
//             colorValues[countryCode]=selectedColor;

//             mapObject.series.regions[0].setValues(colorValues);

//            });
//     });


// var data = {
//   // A labels array that can contain any sort of values
//   labels: ['General American', 'Italian American', 'W. European American', 'European American'],
//   // Our series array that contains series objects or in this case series data arrays
//   series: [
//     [50000, 50000, 40000, 45000]
//   ]
// };

// // Create a new line chart object where as first parameter we pass in a selector
// // that is resolving to our chart container element. The Second parameter
// // is the actual data object.
// new Chartist.Bar('.ct-chart', data);
