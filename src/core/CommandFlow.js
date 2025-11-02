class CommandFlow {
    constructor(client) {
        this.client = client;
        this.commands = new Map();
        this.aliases = new Map();
        this.cooldowns = new Map();
        
        console.log('💬 CommandFlow inicializado');
    }

    async loadCommands(commandsPath = null) {
        try {
            console.log('📁 CommandFlow carregando comandos...');
            
            // Comandos padrão do FlowCord
            this.register({
                name: 'flow',
                description: 'Informações do FlowCord',
                aliases: ['info', 'botinfo'],
                category: 'Geral',
                usage: 'flow',
                execute: (message, args) => {
                    const embed = new this.client.FlowEmbed()
                        .setTitle('💫 FlowCord')
                        .setDescription('Uma biblioteca moderna para bots')
                        .addField('📊 Status', `✅ Online\n⏰ Uptime: ${this.client.FlowUtils.formatTime(this.client.getUptime())}`)
                        .addField('⚙️ Config', `Prefixo: ${this.client.prefix}\nComandos: ${this.commands.size}`)
                        .setColor(this.client.colors.primary);
                    
                    message.reply({ embeds: [embed] });
                }
            });
            
            this.register({
                name: 'ping',
                description: 'Testa a latência do bot',
                category: 'Utilidade',
                execute: (message) => {
                    const start = Date.now();
                    message.reply('🏓 Calculando ping...').then(msg => {
                        const latency = Date.now() - start;
                        msg.edit(`🏓 **Pong!**\n📡 Latência: ${latency}ms`);
                    });
                }
            });
            
        } catch (error) {
            console.error('[CommandFlow] Erro ao carregar comandos:', error);
        }
    }

    register(command) {
        if (this.commands.has(command.name)) {
            throw new Error(`Comando ${command.name} já existe`);
        }
        
        this.commands.set(command.name, command);
        
        // Registrar aliases
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => {
                if (this.aliases.has(alias)) {
                    throw new Error(`Alias ${alias} já está em uso`);
                }
                this.aliases.set(alias, command.name);
            });
        }
        
        console.log(`✅ Comando registrado: ${command.name}`);
        return this;
    }

    handle(message) {
        const args = message.content.slice(this.client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = this.commands.get(commandName) || 
                       this.commands.get(this.aliases.get(commandName));
        
        if (!command) return;
        
        // Verificar cooldown
        if (this.isOnCooldown(message.author.id, command)) {
            return message.reply('⏰ Aguarde antes de usar este comando novamente');
        }
        
        try {
            command.execute(message, args);
            this.setCooldown(message.author.id, command);
        } catch (error) {
            console.error(`[CommandFlow] Erro no comando ${commandName}:`, error);
            
            const embed = new this.client.FlowEmbed()
                .setTitle('❌ Erro no Flow')
                .setDescription('Ocorreu um erro ao executar este comando')
                .setColor(this.client.colors.error);
            
            message.reply({ embeds: [embed] });
        }
    }

    isOnCooldown(userId, command) {
        if (!command.cooldown) return false;
        
        const key = `${userId}-${command.name}`;
        const cooldown = this.cooldowns.get(key);
        
        if (!cooldown) return false;
        if (Date.now() < cooldown) return true;
        
        this.cooldowns.delete(key);
        return false;
    }

    setCooldown(userId, command) {
        if (!command.cooldown) return;
        
        const key = `${userId}-${command.name}`;
        this.cooldowns.set(key, Date.now() + (command.cooldown * 1000));
        
        setTimeout(() => {
            this.cooldowns.delete(key);
        }, command.cooldown * 1000);
    }

    listCommands(category = null) {
        const commands = Array.from(this.commands.values());
        return category ? 
            commands.filter(cmd => cmd.category === category) : 
            commands;
    }
}

module.exports = CommandFlow;