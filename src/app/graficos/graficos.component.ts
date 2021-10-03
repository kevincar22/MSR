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
      let fechas = Object.keys(res)
      let continuar = true
      let i = 0
      while(true){
        
        let sub = valores.slice(i,i+7)
        let subFechas = fechas.slice(i,i+7)
        
        if(i==364){
          for(let valor of sub){
            this.semanas[51] += (Number(valor)/7)
          }
          this.semanas[51]= Number(this.semanas[51].toFixed(2))
          break
        }

        let acumulador = 0
        for(let valor of sub){
          acumulador += Number(valor)
        }
        acumulador /= 7
        acumulador = Number(acumulador.toFixed(2))
        this.semanas.push(acumulador)
        dias.push(this.getFechas(subFechas[0],subFechas[subFechas.length-1]))

        i+=7
        
      }
      console.log(this.semanas)
      dias[51] = this.getFechas("20201223","20201231")
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
      this.chartOptions.xaxis={
        categories: dias
      }
    })
  }

  getFechas(inicio:string,fin:string){
    let añoI = inicio.substr(0,4)
    let mesI = inicio.substr(4,2)
    let diaI = inicio.substr(6)
    let añoF = fin.substr(0,4)
    let mesF = fin.substr(4,2)
    let diaF = fin.substr(6)
    return añoI + "/" + mesI + "/" + diaI + "-" + añoF + "/" + mesF + "/" + diaF
  }

}
