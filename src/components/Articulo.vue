<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="articulos"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar text color="gray">
            <v-toolbar-title>Articulos</v-toolbar-title>
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
            <!--Formulario nuevo-->
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >Nuevo</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="codigo"
                          label="Codigo"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="categorias"
                          v-model="categoria"
                          label="Categorias"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="stock"
                          label="Stock"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="precio_venta"
                          label="precio_venta"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="descripcion"
                          label="Descipción"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" v-show="valida">
                        <div
                          class="red--text"
                          v-for="v in validaMensaje"
                          :key="v"
                          v-text="v"
                        ></div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" @click="close">Cancelar</v-btn>
                  <v-btn color="blue darken-1" @click="guardar">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!--Activar - Desactivar -->
            <v-dialog v-model="adModal" max-width="500px">
              <v-card>
                <v-card-title class="headline" v-if="adAccion == 1"
                  >Activar Item</v-card-title
                >
                <v-card-title class="headline" v-if="adAccion == 2"
                  >Desactivar Item</v-card-title
                >
                <v-card-text>
                  Estas a punto de
                  <span v-if="adAccion == 1">activar</span>
                  <span v-if="adAccion == 2">desactivar</span>
                  el item {{ adNombre }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-3" @click="close()"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    color="red darken-4"
                    v-if="adAccion == 1"
                    @click="activar()"
                    >Activar</v-btn
                  >
                  <v-btn
                    color="red darken-4"
                    v-if="adAccion == 2"
                    @click="desactivar()"
                    >Desactivar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.estado="{ item }">
          <div v-if="item.estado">
            <span class="blue--text text--lighten-4">Activo</span>
          </div>
          <div v-else>
            <span class="red--text text--lighten-4">Inactivo</span>
          </div>
        </template>
        <template v-slot:item.opciones="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
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
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: "",
    articulos: [],
    headers: [
      { text: "Opciones", value: "opciones", sortable: false },
      { text: "Código", value: "codigo", sortable: true },
      { text: "Nombre", value: "nombre", sortable: true },
      { text: "Categoria", value: "categoria.nombre", sortable: true },
      { text: "Stock", value: "stock", sortable: false },
      { text: "Precio Venta", value: "precio_venta", sortable: true },
      { text: "Descripción", value: "descripcion", sortable: true },
      { text: "Estado", value: "estado", sortable: true },
    ],
    desserts: [],
    editedIndex: -1,
    _id: "",
    codigo: "",
    nombre: "",
    categoria: "",
    categorias: [],
    stock: 0,
    precio_venta: 0,
    descripcion: "",
    valida: 0,
    validaMensaje: [],
    adModal: 0,
    adAccion: 0,
    adNombre: "",
    adId: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.getCategorias();
  },

  methods: {
    limpiar() {
      this._id = "";
      this.codigo = "";
      this.nombre = "";
      this.categoria = "";
      this.stock = "";
      this.precio_venta = "";
      this.descripcion = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.categoria) {
        this.validaMensaje.push("* Seleccione una categoria");
      }
      if (this.codigo.length > 64) {
        this.validaMensaje.push(
          "* El codigo del articulo no debe tener mas de 64 caracteres"
        );
      }

      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "* El nombre del articulo no puede estar en blanco ni debe ser mayor a 50 caracteres"
        );
      }
      if (this.descripcion.length < 1 || this.descripcion.length > 250) {
        this.validaMensaje.push(
          "* La descripción no puede estar en blanco ni debe ser mayor a 250 caracteres"
        );
      }
      if (this.stock <= 0) {
        this.validaMensaje.push("* Ingrese un stock valido");
      }
      if (this.precio_venta <= 0) {
        this.validaMensaje.push("* Ingrese un precio valido");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    listar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .get("articulo/list", confg)
        .then(function (response) {
          //console.log(response.data);
          me.articulos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        console.log(this.categoria);
        //Editar Datos
        axios
          .put(
            "articulo/update",
            {
              codigo: this.codigo,
              nombre: this.nombre,
              categoria: this.categoria,
              descripcion: this.descripcion,
              precio_venta: this.precio_venta,
              stock: this.stock,
              _id: this._id,
            },
            confg
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //Guardar nuevo registro
        axios
          .post(
            "articulo/add",
            {
              codigo: this.codigo,
              nombre: this.nombre,
              categoria: this.categoria,
              descripcion: this.descripcion,
              precio_venta: this.precio_venta,
              stock: this.stock,
            },
            confg
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    editItem(item) {
      this._id = item._id;
      this.codigo = item.codigo;
      this.nombre = item.nombre;
      this.descripcion = item.descripcion;
      this.stock = item.stock;
      this.precio_venta = item.precio_venta;
      this.dialog = true;
      this.editedIndex = 1;
      console.log(this.categoria);
    },

    activarDesactivar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .put(
          "articulo/activate",
          {
            _id: this.adId,
          },
          confg
        )
        .then(function (response) {
          me.adModal = 0;
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
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .put(
          "articulo/deactivate",
          {
            _id: this.adId,
          },
          confg
        )
        .then(function (response) {
          me.adModal = 0;
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
    },
    getCategorias() {
      let me = this;
      var categoriaArray = [];
      let header = { token: this.$store.state.token };
      let confg = { headers: header };
      axios
        .get("categoria/list", confg)
        .then(function (response) {
          categoriaArray = response.data;
          categoriaArray.map(function (x) {
            me.categorias.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>