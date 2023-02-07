var express = require('express');
var router = express.Router();
const { cu_clientes, del_clientes, read_clientes, read_clientesIDS} = require('../controllers/clientes');
const { c_inventario, u_data_inventario, del_inventario, read_inventario, read_inventarioIDS, u_cant_venta_inventario, u_cant_compra_inventario} = require('../controllers/inventario');
const { c_venta,read_venta_id, u_venta, del_venta,del_ventaMarc, read_ventas , read_ventasIDS,read_ventas_user,read_ventas_user_time } = require('../controllers/ventas');
const limpiar = require("../controllers/limpiar")
const { verifyToken } = require("../verifyToken/verifyToken")
const { servicio } = require("../verifyToken/servicio")

router.post("/cu_clientes", verifyToken, cu_clientes);
router.post("/del_clientes", verifyToken, del_clientes);
router.post("/read_clientes", read_clientes);
router.get("/read_clientesIDS", read_clientesIDS);

router.post("/c_inventario", verifyToken, c_inventario);
router.post("/u_data_inventario",servicio, verifyToken, u_data_inventario);
router.post("/del_inventario",servicio, verifyToken, del_inventario);
router.post("/read_inventario", read_inventario);
router.get("/read_inventarioIDS", read_inventarioIDS);
router.post("/u_cant_venta_inventario",servicio, verifyToken, u_cant_venta_inventario);
router.post("/u_cant_compra_inventario",servicio, verifyToken, u_cant_compra_inventario);

router.post("/c_venta",servicio, verifyToken, c_venta);
router.post("/read_venta_id",verifyToken, read_venta_id);
router.post("/u_venta",servicio, verifyToken, u_venta);
router.post("/del_venta",servicio,verifyToken, del_venta);
router.post("/del_ventaMarc",servicio,verifyToken, del_ventaMarc);
router.post("/read_ventas", read_ventas);
router.post("/read_ventas_user", read_ventas_user);
router.post("/read_ventas_user_time", read_ventas_user_time);
router.get("/read_ventasIDS", read_ventasIDS);

router.post("/read_numNota",servicio,verifyToken, limpiar.read_numNota);
router.post("/write_numNota",servicio,verifyToken, limpiar.write_numNota);

module.exports = router;