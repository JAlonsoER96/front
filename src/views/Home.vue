<template>
  <v-container grid-list-m>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" xs="12">
        <div class="ct-chart" style="background: white">
          <canvas id="myChart"> </canvas>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" xs="12">
        <div class="ct-chart" style="background: white">
          <canvas id="graficaIngreso"> </canvas>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";
export default {
  data: () => ({
    valores: [],
    meses: [],
    totales: [],
    valoresIngre: [],
    mesesIngre: [],
    totalesIngre: [],
  }),
  methods: {
    listar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .get("venta/grafico12meses", confg)
        .then(function (response) {
          me.valores = response.data;
          me.graficar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    graficar() {
      let me = this;
      let mesN;
      me.valores.map(function (x) {
        switch (parseInt(x._id.mes)) {
          case 1:
            mesN = "Enero";
            break;
          case 2:
            mesN = "Febrero";
            break;
          case 3:
            mesN = "Marzo";
            break;
          case 4:
            mesN = "Abril";
            break;
          case 5:
            mesN = "Mayo";
            break;
          case 6:
            mesN = "Junio";
            break;
          case 7:
            mesN = "Julio";
            break;
          case 8:
            mesN = "Agosto";
            break;
          case 9:
            mesN = "Setiembre";
            break;
          case 10:
            mesN = "Octubre";
            break;
          case 11:
            mesN = "Noviembre";
            break;
          case 12:
            mesN = "Diciembre";
            break;
          default:
            mesN = "error";
        }
        me.meses.push(mesN + "/" + x._id.year);
        me.totales.push(x.total);
      });
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: me.meses,
          datasets: [
            {
              label: "Ventas de los últimos 12 meses",
              data: me.totales,
              backgroundColor: [
                "rgba(98, 201, 0, 100)",
                "rgba(255, 73, 0 , 100)",
                "rgba(252, 255, 0, 10)",
                "rgba(27, 217, 0, 10)",
                "rgba(0, 144, 213, 10)",
                "rgba(0, 70, 213, 10)",
                "rgba(236, 0, 18, 10)",
                "rgba(0, 225, 132, 10)",
                "rgba(146, 240, 0, 10)",
                "rgba(0, 179, 0, 10)",
                "rgba(249, 44, 8,10)",
                "rgba(0, 174, 173, 10)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          title: {
            display: false,
          },
        },
      });
    },
    listarIngresos() {
      let me = this;
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .get("ingreso/grafico12meses", confg)
        .then(function (response) {
          me.valoresIngre = response.data;
          me.graficarIngresos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    graficarIngresos() {
      let me = this;
      let mesN;
      me.valoresIngre.map(function (x) {
        switch (parseInt(x._id.mes)) {
          case 1:
            mesN = "Enero";
            break;
          case 2:
            mesN = "Febrero";
            break;
          case 3:
            mesN = "Marzo";
            break;
          case 4:
            mesN = "Abril";
            break;
          case 5:
            mesN = "Mayo";
            break;
          case 6:
            mesN = "Junio";
            break;
          case 7:
            mesN = "Julio";
            break;
          case 8:
            mesN = "Agosto";
            break;
          case 9:
            mesN = "Setiembre";
            break;
          case 10:
            mesN = "Octubre";
            break;
          case 11:
            mesN = "Noviembre";
            break;
          case 12:
            mesN = "Diciembre";
            break;
          default:
            mesN = "error";
        }
        me.mesesIngre.push(mesN + "/" + x._id.year);
        me.totalesIngre.push(x.total);
      });
      var ctx = document.getElementById("graficaIngreso");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: me.mesesIngre,
          datasets: [
            {
              label: "Ingresos de los últimos 12 meses",
              data: me.totalesIngre,
              backgroundColor: [
                "rgba(0, 225, 132, 10)",
                "rgba(27, 217, 0, 10)",
                "rgba(0, 144, 213, 10)",
                "rgba(0, 70, 213, 10)",
                "rgba(236, 0, 18, 10)",
                "rgba(0, 179, 0, 10)",
                "rgba(249, 44, 8,10)",
                "rgba(0, 174, 173, 10)",
                "rgba(146, 240, 0, 10)",
                "rgba(98, 201, 0, 100)",
                "rgba(255, 73, 0 , 100)",
                "rgba(252, 255, 0, 10)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          title: {
            display: false,
          },
        },
      });
    },
  },
  mounted() {
    this.listar();
    this.listarIngresos();
  },
};
</script>