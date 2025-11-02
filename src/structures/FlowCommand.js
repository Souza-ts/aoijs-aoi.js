class FlowCommand {
    constructor(options = {}) {
        if (!options.name) throw new Error('Nome do comando é obrigatório');
        if (!options.execute) throw new Error('Função execute é obrigatória');
        
        this.name = options.name;
        this.description = options.description || 'Sem descrição';
        this.aliases = options.aliases || [];
        this.category = options.category || 'Geral';
        this.usage = options.usage || options.name;
        this.cooldown = options.cooldown || 3;
        this.ownerOnly = options.ownerOnly || false;
        this.userPermissions = options.userPermissions || [];
        this.botPermissions = options.botPermissions || [];
        this.execute = options.execute;
    }
}

module.exports = FlowCommand;