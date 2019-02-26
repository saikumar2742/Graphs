import Highcharts from 'highcharts';
import { pick } from 'lodash';

export function barLineChart(xaxis, yaxis, data, chartType) {
  if (xaxis === yaxis) {
    alert('Please select different x-axis and y-axis');
    return true;
  }
  data = data.map(item => pick(item, [xaxis, yaxis]));
  for (var i = 0; i < data.length; i++) {
    if (xaxis !== 'name') {
      data[i]['name'] = data[i][xaxis];
      delete data[i][xaxis];
    }
    if (yaxis !== 'y') {
      if (data[i].y) {
        data[i]['x'] = data[i].y;
        delete data[i].y;
      }
      if (isNaN(parseInt(data[i][yaxis], 10))) {
        alert('All y-axis values should be integers to draw bar chart');
        return true;
      }
      data[i].y = parseInt(data[i][yaxis], 10);
      delete data[i][yaxis];
    }
  }
  Highcharts.chart('container', {
    chart: {
      type: chartType,
    },
    xAxis: {
      type: 'category',
      title: {
        text: xaxis,
      },
    },
    yAxis: {
      title: {
        text: yaxis,
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>',
    },
    series: [
      {
        data,
      },
    ],
  });
}
