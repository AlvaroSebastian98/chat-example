// {
//     id: 'Alhajsd0-a122h',
//     nombre: 'Alvaro',
//     sala: 'Video Juegos'
// }


class Usuarios {

    constructor() {
        this.personas = []
    }

    agregarPersona(id, nombre, sala) {
        let persona = {id, nombre, sala}
        this.personas.push(persona)
        // return this.personas.filter(p => p.sala === persona.sala)
    }

    obtenerPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0]
        return persona
    }

    obtenerPersonas() {
        return this.personas
    }

    obtenerPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala)
        return personasEnSala
    }

    borrarPersona(id) {
        let personaBorrada = this.obtenerPersona(id)
        this.personas = this.personas.filter(persona => persona.id != id)

        return personaBorrada
    }

}

module.exports = Usuarios