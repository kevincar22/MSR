import { Component, OnInit } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent {

  semanas:any = []

  public chartOptions: Partial<any>;

  constructor(){
    this.chartOptions={
      
      series: [
        {
          name: "My-series",
          data: []
        }
      ],
      
      chart: {
        height: 3500,
        type: "bar"
      },
      title: {
        text: "My First Angular Chart"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%'
        }
      }
    
      
    }

    fetch(
      "https://cors-anywhere.herokuapp.com/"+ "https://power.larc.nasa.gov/api/temporal/daily/point?start=20200101&end=20201231&latitude=-0.1085979&longitude=-78.4683587&community=ag&parameters=ALLSKY_SFC_SW_DIRH&format=json&header=true&time-standard=lst",
    )
    .then(data=>data.json())
    .then(res=>{
      let dias:any = []
      res = res.properties.parameter.ALLSKY_SFC_SW_DIRH
      let valores = Object.values(res)
      let continuar = true
      let i = 0
      while(continuar){
        
        let sub = valores.slice(i,i+7)
        
        let acumulador = 0
        for(let valor of sub){
          acumulador += Number(valor)
        }
        acumulador /= 7
        this.semanas.push(acumulador)
        i+=7
        if(i>valores.length){
          continuar = false
        }
      }
      console.log(this.semanas)
      /*
      for(let dato in res){
        console.log(dato)
        if(this.semanas.length<52){
          this.semanas.push(res[dato])
          dias.push(dato)
        }
        
      }
      */
      this.chartOptions.series=[
        {
          data: this.semanas
        }
      ]
    })
  }

}
