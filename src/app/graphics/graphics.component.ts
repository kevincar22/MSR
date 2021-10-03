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

  semanas: any = []
  period: string | null
  year = new Date().getFullYear() - 1

  public chartOptions: Partial<any>;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap
      .subscribe(params => {
        console.log(params)
        this.period = params.get('tipo')
        if (params.get('tipo') == "weekly") {
          this.graficoSemana()
        } else if (params.get('tipo') == "monthly") {
          this.graficoMensual()
        }
      })
  }

  graficoSemana() {
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
      "https://damp-beach-17296.herokuapp.com/" + "https://power.larc.nasa.gov/api/temporal/daily/point?start=" + this.year + "0101&end=" + this.year + "1231&latitude=-0.1085979&longitude=-78.4683587&community=ag&parameters=ALLSKY_SFC_SW_DIRH&format=json&header=true&time-standard=lst",
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
        console.log(this.semanas)
        dias[51] = this.getFechas("20201223", "20201231")
        this.chartOptions.series = [
          {
            name: "Irradiance Average",
            data: this.semanas
          }
        ]
        this.chartOptions.xaxis = {
          categories: dias
        }

      })
  }

  graficoMensual() {
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
      "https://cors-anywhere.herokuapp.com/" + "https://power.larc.nasa.gov/api/temporal/monthly/point?start=2020&end=2020&latitude=-0.1085979&longitude=-78.4683587&community=ag&parameters=ALLSKY_SFC_SW_DIRH&format=json&header=true&time-standard=lst",
    )
      .then(data => data.json())
      .then(res => {
        res = res.properties.parameter.ALLSKY_SFC_SW_DIRH
        this.chartOptions.series = [
          {
            data: Object.values(res)
          }
        ]
        console.log(res)
      })
  }

  getFechas(inicio: string, fin: string) {
    let añoI = inicio.substr(0, 4)
    let mesI = inicio.substr(4, 2)
    let diaI = inicio.substr(6)
    let añoF = fin.substr(0, 4)
    let mesF = fin.substr(4, 2)
    let diaF = fin.substr(6)
    return añoI + "/" + mesI + "/" + diaI
  }

}

/*
var form: HTMLFormElement = document.querySelector('#myform');


form.onsubmit = () => {
  const formData = new FormData(form);

  const text = formData.get('Longi') as string;
  console.log(text);
  return false; // prevent reload
};*/


