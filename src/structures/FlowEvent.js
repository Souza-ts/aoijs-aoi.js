class FlowEvent {
    constructor(options = {}) {
        if (!options.name) throw new Error('Nome do evento é obrigatório');
        if (!options.execute) throw new Error('Função execute é obrigatória');
        
        this.name = options.name;
        this.once = options.once || false;
        this.execute = options.execute;
    }
}

module.exports = FlowEvent;