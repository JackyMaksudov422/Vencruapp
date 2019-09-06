import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

const data = {
	labels: [	
        'Green',	
        'Red'	
	],
	datasets: [{
		data: [62, 38],
		backgroundColor: [		
        '#A0D468',		
        '#F56A6A',
		],
		hoverBackgroundColor: [		
        '#A0D468',
        '#F56A6A',
		]
    }],
    text : "Hello"
};

const options = {
    cutoutPercentage: 70,
    maintainAspectRatio: false,
    legend : {
        display : false
    },
    // onHover : (e, elems) => { console.log(e, elems) }
};
export class DoughnutChart extends Component {
    render(){
        return <Doughnut width={120} height={120} data={data} options={options}/>
    }
}
