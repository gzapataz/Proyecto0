/*jshint esversion: 6 */

class Event {
    constructor(id, userid, nombre, fechaInicio, fechaFin) {
        this.id = id;
        this.userid = userid
        this.descripcion = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = 'Pendiente';
    }
    save() {
        console.log('Evento agregado a la base de datos ...');
    }

}

module.exports = Event;