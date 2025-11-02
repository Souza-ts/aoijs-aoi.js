class FlowManager {
    constructor(client) {
        this.client = client;
        this.events = new Map();
    }

    async loadEvents(eventsPath = null) {
        try {
            console.log('📁 FlowManager carregando eventos...');
            
            // Eventos padrão do FlowCord
            this.register('flowReady', (client) => {
                console.log(`💫 Flow está rodando! Prefixo: ${client.prefix}`);
            });
            
            this.register('flowError', (error) => {
                console.error('💥 Erro no Flow:', error);
            });
            
            this.register('messageCreate', (message) => {
                // Sistema de comandos
                if (message.content.startsWith(this.client.prefix)) {
                    this.client.commands.handle(message);
                }
                
                // Eventos customizados
                this.client.emit('flowMessage', message);
            });
            
        } catch (error) {
            console.error('[FlowManager] Erro ao carregar eventos:', error);
        }
    }

    register(name, callback) {
        this.events.set(name, callback);
        this.client.on(name, callback);
        console.log(`🔔 Evento registrado: ${name}`);
    }

    unregister(name) {
        const callback = this.events.get(name);
        if (callback) {
            this.client.off(name, callback);
            this.events.delete(name);
            console.log(`🔕 Evento removido: ${name}`);
        }
    }

    listEvents() {
        return Array.from(this.events.keys());
    }
}

module.exports = FlowManager;