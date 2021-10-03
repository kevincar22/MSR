import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


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
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent {

  //valores2: any = []
  dias2: any=[]
  //alphas:string[]; 
  semanas: any=[]
  semanasN: number[];
  period: string | null
  year = new Date().getFullYear() - 1
  lat: string = "-2.1482271";
  lon: string = "-79.9666812";

  updateLatLon(lat: string, lon: string) {
    this.lat = lat;
    this.lon = lon;
    if (this.period == "weekly") {
      this.graficoSemana(this.lat, this.lon)
    } else if (this.period == "monthly") {
      this.graficoMensual(this.lat, this.lon)
    }
  }

  showSort(){
    console.log("SEmanas Sort",this.semanasN)
    console.log("Dias Sort",this.dias2)
    this.chartOptions.series = [
      {
        name: "Irradiance Average",
        data: this.semanasN
      }
    ]
    this.chartOptions.xaxis = {
      categories: this.dias2
    }
    
  }

  public chartOptions: Partial<any>;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap
      .subscribe(params => {
        console.log(params)
        this.period = params.get('tipo')
        if (this.period == "weekly") {
          this.graficoSemana(this.lat, this.lon)
        } else if (this.period == "monthly") {
          this.graficoMensual(this.lat, this.lon)
        }
      })
  }

  graficoSemana(lat: string, lon: string) {
    this.semanas = []
    this.chartOptions = {
      fill: {
        colors: ['#07173F']
      },
      series: [
        {
          name: "Irradiance Average",
          data: []
        }
      ],
      chart: {
        height: 3500,
        type: "bar",
        foreColor: '#03045e'
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      }
    }

    fetch(
      "https://damp-beach-17296.herokuapp.com/" + "https://power.larc.nasa.gov/api/temporal/daily/point?start=" + this.year + "0101&end=" + this.year + "1231&latitude=" + lat + "&longitude=" + lon + "&community=ag&parameters=ALLSKY_SFC_SW_DIRH&format=json&header=true&time-standard=lst",
    )
      .then(data => data.json())
      .then(res => {
        let dias: any = []
        res = res.properties.parameter.ALLSKY_SFC_SW_DIRH
        let valores = Object.values(res)        
        let fechas = Object.keys(res)
        
        let continuar = true
        let i = 0
        while (true) {

          let sub = valores.slice(i, i + 7)
          let subFechas = fechas.slice(i, i + 7)

          if (i == 364) {
            for (let valor of sub) {
              this.semanas[51] += (Number(valor) / 7)
            }
            this.semanas[51] = Number(this.semanas[51].toFixed(2))
            break
          }

          let acumulador = 0
          for (let valor of sub) {
            acumulador += Number(valor)
          }
          acumulador /= 7
          acumulador = Number(acumulador.toFixed(2))
          this.semanas.push(acumulador)
          dias.push(this.getFechas(subFechas[0], subFechas[subFechas.length - 1]))

          i += 7

        }

               
        dias[51] = this.getFechas("20201223", "20201231")
        

        //
        let valores2 = Object.assign([], this.semanas);
        let semanasOr = Object.assign([], this.semanas);
        this.semanasN = this.semanas.map(function (x: string) { 
          return parseFloat(x); 
        });
        
        this.semanasN.sort(function(a, b) {
          return a - b;
        });       
        this.semanasN.reverse();
        this.dias2 = [];

        for(let i of this.semanasN){          
          let pos_max = valores2.indexOf(i);          
          this.dias2.push(dias[pos_max]);
          valores2[pos_max]=-2;
        }

        console.log("Fechas: ",dias)
        console.log("VALORES: ",semanasOr)
        this.chartOptions.series = [
          {
            name: "Irradiance Average",
            data: semanasOr
          }
        ]
        this.chartOptions.xaxis = {
          categories: dias
        }

      })
  }

  graficoMensual(lat: string, lon: string) {
    this.chartOptions = {

      series: [
        {
          name: "Irradiance Average",
          data: []
        }
      ],
      fill: {
        colors: ['#07173F']
      },
      chart: {
        height: 550,
        type: "bar",
        foreColor: '#03045e'
      },
      xaxis: {
        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '70%'
        }
      }


    }

    fetch(
      "https://damp-beach-17296.herokuapp.com/" + "https://power.larc.nasa.gov/api/temporal/monthly/point?start=" + this.year + "&end=" + this.year + "&latitude="+lat+"&longitude="+lon+"&community=ag&parameters=ALLSKY_SFC_SW_DIRH&format=json&header=true&time-standard=lst",
    )
      .then(data => data.json())
      .then(res => {
        res = res.properties.parameter.ALLSKY_SFC_SW_DIRH
        this.chartOptions.series = [
          {
            data: Object.values(res)
          }
        ]
        console.log()
      })
  }

  getFechas(inicio: string, fin: string) {
    let añoI = inicio.substr(0, 4)
    let mesI = inicio.substr(4, 2)
    let diaI = inicio.substr(6)
    return añoI + "/" + mesI + "/" + diaI
  }

}