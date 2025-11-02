const { EventEmitter } = require('events');
const FlowManager = require('./FlowManager');
const CommandFlow = require('./CommandFlow');

class FlowClient extends EventEmitter {
    constructor(options = {}) {
        super();
        
        // Configurações essenciais
        this.token = options.token;
        this.prefix = options.prefix || '!';
        this.owners = options.owners || [];
        
        // Sistema de cores para console
        this.colors = {
            primary: 0x5865F2,
            success: 0x57F287,
            warning: 0xFEE75C,
            error: 0xED4245
        };
        
        // Gerenciadores
        this.flow = new FlowManager(this);
        this.commands = new CommandFlow(this);
        
        // Estado do cliente
        this.ready = false;
        this.user = null;
        this.uptime = null;
        
        console.log('🚀 FlowCord inicializado');
    }

    async login(token = this.token) {
        if (!token) throw new Error('[FlowCord] Token não fornecido');
        this.token = token;

        try {
            // Carregar componentes
            await this.flow.loadEvents();
            await this.commands.loadCommands();
            
            // Simular conexão (substituir por API real)
            this.ready = true;
            this.user = { 
                username: 'FlowBot', 
                id: '000000000',
                tag: 'FlowBot#0000'
            };
            this.uptime = Date.now();
            
            this.emit('flowReady', this);
            console.log(`✅ FlowCord conectado como ${this.user.tag}`);
            
        } catch (error) {
            this.emit('flowError', error);
            throw error;
        }
        
        return this;
    }

    // Métodos de utilidade
    getUptime() {
        return this.ready ? Date.now() - this.uptime : 0;
    }

    isOwner(userId) {
        return this.owners.includes(userId);
    }

    destroy() {
        this.ready = false;
        this.uptime = null;
        this.removeAllListeners();
        console.log('🔴 FlowCord desconectado');
    }
}

module.exports = FlowClient;