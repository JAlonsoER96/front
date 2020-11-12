<template>
  <v-layout align-start>
    <v-flex>
      <!-- Lista de ingresos -->
      <v-data-table
        :headers="headers"
        :items="ventas"
        :search="search"
        class="elevation-1"
        v-if="!verNuevo"
      >
        <template v-slot:top>
          <v-toolbar text color="gray">
            <v-toolbar-title>Ingresos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              name="search"
              class="text-xs-center"
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="mostrarNuevo()">
              Nuevo
            </v-btn>
            <!-- Lista de articulos -->
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Seleccione un articulo</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md> </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" @click="close">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.estado="{ item }">
          <div v-if="item.estado">
            <span class="blue--text text--lighten-4">Aceptado</span>
          </div>
          <div v-else>
            <span class="red--text text--lighten-4">Rechazado</span>
          </div>
        </template>
        <template v-slot:item.opciones="{ item }">
          <v-icon small @click="verIngreso(item)">tab</v-icon>
          <template v-if="item.estado">
            <v-icon small @click="activarDesactivar(2, item)">block</v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activarDesactivar(1, item)">check</v-icon>
          </template>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar">Reiniciar</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4" v-if="verNuevo">
        <v-row>
          <v-col cols="12" xs="12" sm="4" md="4" lg="4">
            <v-select
              :items="comprobantes"
              v-model="tipo_comprobante"
              label="Tipo Comprobante"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" sm="4" md="4" lg="4">
            <v-text-field
              v-model="serie_comprobante"
              label="Serie Comprobante"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="4" md="4" lg="4">
            <v-text-field
              v-model="num_comprobante"
              label="Número comprobante"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="8" md="8" lg="8">
            <v-autocomplete :items="personas" v-model="persona" label="Cliente">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" xs="12" sm="4" md="4" lg="4">
            <v-text-field
              type="number"
              v-model="impuesto"
              label="Impuesto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="8" md="8" lg="8">
            <v-text-field
              v-model="codigo"
              label="Código de barras"
              @keyup.enter="buscarCodigo()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="1" md="1" lg="1">
            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" xs="12" sm="3" md="3" lg="3" v-show="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-col>
          <!-- Detalles ingreso -->
          <v-col cols="12" xs="12" sm="12" md="12" lg="12">
            <v-data-table
              :headers="headersDetalles"
              :items="detalles"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:item.borrar="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="eliminaDetalle(detalles, item)"
                  >delete</v-icon
                >
              </template>
              <template v-slot:item.subtotal="{ item }">
                $ {{ item.precio * item.cantidad - item.descuento }}
              </template>
              <template v-slot:item.cantidad="{ item }">
                <v-text-field
                  v-model="item.cantidad"
                  type="number"
                ></v-text-field>
              </template>
              <template v-slot:item.precio="{ item }">
                <v-text-field
                  v-model="item.precio"
                  type="number"
                ></v-text-field>
              </template>
              <template v-slot:item.descuento="{ item }">
                <v-text-field
                  v-model="item.descuento"
                  type="number"
                ></v-text-field>
              </template>
            </v-data-table>
            <v-flex style="text-xs-right">
              <strong>Total parcial </strong>$
              {{ (totalParcial = (total - totalImpuesto).toFixed(2)) }}
            </v-flex>
            <v-flex style="text-xs-right">
              <strong>Total impuesto </strong>$
              {{
                (totalImpuesto = ((total * impuesto) / (1 + impuesto)).toFixed(
                  2
                ))
              }}
            </v-flex>
            <v-flex style="text-xs-right">
              <strong>Total neto </strong>$ {{ (total = totalT) }}
            </v-flex>
          </v-col>
          <v-col
            cols="12"
            xs="12"
            sm="12"
            md="12"
            lg="12"
            v-show="valida"
            style="d-inline"
          >
            <v-list
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            >
            </v-list>
          </v-col>
          <v-btn color="blue darken-1" @click.native="ocultarNuevo()"
            >Cancelar</v-btn
          >
          <v-btn
            color="success"
            @click.native="guardar()"
            v-if="verDetalle == 0"
            >Guardar</v-btn
          >
        </v-row>
        <!-- Modal seleccioón articulo -->
        <v-dialog v-model="detaMod" max-width="1000px" v-if="verNuevo">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      v-model="texto"
                      @keyup.enter="listarArticulos()"
                      class="text-xs-center"
                      append-icon="search"
                      label="Búsqueda"
                    ></v-text-field>
                    <v-data-table
                      :headers="headersArticulo"
                      :items="articulos"
                      hide-default-footer
                    >
                      <template v-slot:item.seleccionar="{ item }">
                        <v-btn
                          color="success"
                          class="mr-2"
                          @click="agregarDetalles(item)"
                        >
                          <v-icon small>add</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:item.estado="{ item }">
                        <div v-if="item.estado">
                          <span class="blue--text text--lighten-4">Activo</span>
                        </div>
                        <div v-else>
                          <span class="red--text text--lighten-4"
                            >Inactivo</span
                          >
                        </div>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" @click="ocultarModArt()"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <!-- Activar - Desactivar -->
      <v-dialog v-model="actDesMod" max-width="320px">
        <v-card>
          <v-card-title class="headline" v-if="adAccion == 1">
            Activar Item
          </v-card-title>
          <v-card-title class="headline" v-if="adAccion == 2">
            Desactivar Item
          </v-card-title>
          <v-card-text>
            Estás a punto de <span v-if="adAccion == 1">activar </span>
            <span v-if="adAccion == 2">desactivar </span> el item {{ adNombre }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="activarDesactivarCerrar()" color="green darken-1">
              Cancelar
            </v-btn>
            <v-btn
              v-if="adAccion == 1"
              @click="activar()"
              color="orange darken-4"
            >
              Activar
            </v-btn>
            <v-btn
              v-if="adAccion == 2"
              @click="desactivar()"
              color="orange darken-4"
            >
              Desactivar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: "",
    ventas: [],
    headers: [
      {
        text: "Opciones",
        value: "opciones",
        sortable: false,
      },
      {
        text: "Usuario",
        value: "usuario.nombre",
        sortable: true,
      },
      {
        text: "Cliente",
        value: "persona.nombre",
        sortable: true,
      },
      {
        text: "Comprobante",
        value: "tipo_comprobante",
        sortable: true,
      },
      {
        text: "Serie Comprobante",
        value: "serie_comprobante",
        sortable: false,
      },
      {
        text: "Número Comprobante",
        value: "num_comprobante",
        sortable: false,
      },
      {
        text: "Fecha",
        value: "createdAt",
        sortable: false,
      },
      {
        text: "Impuesto",
        value: "impuesto",
        sortable: false,
      },
      {
        text: "Total",
        value: "total",
        sortable: false,
      },
      {
        text: "Estado",
        value: "estado",
        sortable: true,
      },
    ],
    editedIndex: -1,
    _id: "",
    impuesto: 0.18,
    personas: [],
    persona: "",
    codigo: "",
    headersDetalles: [
      {
        text: "Borrar",
        value: "borrar",
        sortable: false,
      },
      {
        text: "Articulo",
        value: "articulo",
        sortable: false,
      },
      {
        text: "Cantidad",
        value: "cantidad",
        sortable: false,
      },
      {
        text: "Precio",
        value: "precio",
        sortable: false,
      },
      { text: "Descuento", value: "descuento", sortable: false },
      {
        text: "Sub Total",
        value: "subtotal",
        sortable: false,
      },
    ],
    detalles: [],
    verNuevo: false,
    comprobantes: ["Boleta", "Factura", "Ticket"],
    num_comprobante: "",
    tipo_comprobante: "",
    serie_comprobante: "",
    valida: 0,
    validaMensaje: [],
    actDesMod: 0,
    adAccion: 0,
    adNombre: "",
    adId: "",
    errorArticulo: null,
    total: 0,
    totalParcial: 0,
    totalImpuesto: 0,
    articulos: [],
    texto: "",
    headersArticulo: [
      {
        text: "Seleccionar",
        value: "seleccionar",
        sortable: false,
      },
      {
        text: "Código",
        value: "codigo",
        sortable: true,
      },
      {
        text: "Nombre",
        value: "nombre",
        sortable: true,
      },
      {
        text: "Categoria",
        value: "categoria.nombre",
        sortable: true,
      },
      {
        text: "Stock",
        value: "stock",
        sortable: false,
      },
      {
        text: "Precio Venta",
        value: "precio_venta",
        sortable: true,
      },
      {
        text: "Descripción",
        value: "descripcion",
        sortable: true,
      },
      {
        text: "Estado",
        value: "estado",
        sortable: true,
      },
    ],
    adModal: 0,
    detaMod: 0,
    verDetalle: 0,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
    totalT: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado +
          this.detalles[i].cantidad * this.detalles[i].precio -
          this.detalles[i].descuento;
      }
      return resultado;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectProve();
  },

  methods: {
    limpiar() {
      this.persona = "";
      this.tipo_comprobante = "";
      this.num_comprobante = "";
      this.serie_comprobante = "";
      this.num_documento = "";
      this.impuesto = 0.18;
      this.codigo = "";
      this.total = 0;
      this.totalParcial = 0;
      this.totalImpuesto = 0;
      this.detalles = [];
      this.ocultarNuevo();
      this.valida = 0;
      this.validaMensaje = [];
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.persona) {
        this.validaMensaje.push("Seleccione un cliente");
      }
      if (!this.tipo_comprobante) {
        this.validaMensaje.push("Seleccione un tipo de comprobante");
      }
      if (!this.num_comprobante) {
        this.validaMensaje.push("Ingrese un numero de comprobante");
      }
      if (!this.impuesto || this.impuesto < 0 || this.impuesto > 1) {
        this.validaMensaje.push("Ingrese un impuesto valido");
      }
      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un artpiculo a los detalles");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    selectProve() {
      let me = this;
      var proveeArray = [];
      let header = {
        token: this.$store.state.token,
      };
      let confg = {
        headers: header,
      };
      axios
        .get("persona/listClientes", confg)
        .then(function (response) {
          proveeArray = response.data;
          proveeArray.map(function (x) {
            me.personas.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    buscarCodigo() {
      let me = this;
      let header = {
        token: this.$store.state.token,
      };
      let confg = {
        headers: header,
      };
      me.errorArticulo = null;
      axios
        .get("articulo/queryCodigo?codigo=" + this.codigo, confg)
        .then(function (response) {
          me.agregarDetalles(response.data);
        })
        .catch(function (error) {
          me.errorArticulo = "No existe el artículo";
        });
    },
    listar() {
      let me = this;
      let header = {
        token: this.$store.state.token,
      };
      let confg = {
        headers: header,
      };
      axios
        .get("venta/list", confg)
        .then(function (response) {
          me.ventas = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarArticulos() {
      let me = this;
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .get("articulo/list?valor=" + this.texto, confg)
        .then(function (response) {
          me.articulos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarDetalles(id) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("venta/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.detalles;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verIngreso(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante = item.num_comprobante;
      this.persona = item.persona._id;
      this.impuesto = item.impuesto;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
    },
    guardar() {
      let me = this;
      let header = {
        token: this.$store.state.token,
      };
      let confg = {
        headers: header,
      };
      if (this.validar()) {
        return;
      }
      //Guardar nuevo registro
      axios
        .post(
          "venta/add",
          {
            usuario: this.$store.state.usuario._id,
            persona: this.persona,
            tipo_comprobante: this.tipo_comprobante,
            num_comprobante: this.num_comprobante,
            serie_comprobante: this.serie_comprobante,
            impuesto: this.impuesto,
            total: this.total,
            detalles: this.detalles,
          },
          confg
        )
        .then(function (response) {
          me.limpiar();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    activarDesactivar(accion, item) {
      this.actDesMod = 1;
      this.adNombre = item.num_comprobante;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.actDesMod = 0;
      }
    },
    activar() {
      let me = this;
      let header = {
        token: this.$store.state.token,
      };
      let confg = {
        headers: header,
      };
      axios
        .put(
          "venta/activate",
          {
            _id: this.adId,
          },
          confg
        )
        .then(function (response) {
          me.actDesMod = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = {
        token: this.$store.state.token,
      };
      let confg = {
        headers: header,
      };
      axios
        .put(
          "venta/deactivate",
          {
            _id: this.adId,
          },
          confg
        )
        .then(function (response) {
          me.actDesMod = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    close() {
      this.dialog = false;
      this.adModal = 0;
      this.limpiar();
    },
    mostrarNuevo() {
      this.verNuevo = true;
    },
    ocultarNuevo() {
      this.verNuevo = false;
      this.detalles = [];
      this.persona = "";
      this.tipo_comprobante = "";
      this.num_comprobante = "";
      this.serie_comprobante = "";
      this.num_documento = "";
      this.impuesto = 0.18;
      this.codigo = "";
      this.total = 0;
      this.totalParcial = 0;
      this.totalImpuesto = 0;
      this.verDetalle = 0;
    },
    agregarDetalles(datos) {
      this.errorArticulo = null;
      if (this.validaNuevo(datos._id)) {
        this.errorArticulo = "El artículo ya fue agregado";
      } else {
        this.detalles.push({
          _id: datos._id,
          articulo: datos.nombre,
          cantidad: 1,
          precio: datos.precio_venta,
          descuento: 0,
        });
        this.codigo = "";
      }
    },
    validaNuevo(id) {
      let estado = false;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id == id) estado = true;
      }
      return estado;
    },
    eliminaDetalle(details, item) {
      this.errorArticulo = null;
      let i = details.indexOf(item);
      if (i != -1) {
        details.splice(i, 1);
      }
    },
    mostrarModalArticulos() {
      this.detaMod = 1;
    },
    ocultarModArt() {
      this.detaMod = 0;
      this.texto = "";
      this.articulos = [];
    },
    activarDesactivarCerrar() {
      this.actDesMod = 0;
    },
  },
};
/*

 */
</script>
