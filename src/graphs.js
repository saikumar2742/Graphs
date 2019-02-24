import Highcharts from 'highcharts';

export function barChart(xaxis, yaxis, data){
    debugger;
    var i;
    for(i = 0; i < data.length; i++){
        if(xaxis!=='name'){
            data[i].name = data[i][xaxis];
            delete data[i][xaxis];
        }
        if(yaxis!=='id'){
            data[i].y = parseInt(data[i][yaxis],10);
            delete data[i][yaxis];
        }
    }
    debugger;
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        xAxis: {
            title: {
                text: xaxis
            }
        },
        yAxis: {
            title: {
                text: yaxis
            }
        },
        series: [{
            data: [{name: 1, id: 1, }, {name: 2, id: 11, }]
        }]
      });

}