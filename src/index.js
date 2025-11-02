const FlowClient = require('./core/FlowClient');
const { FlowCommand, FlowEvent, FlowEmbed } = require('./structures');

module.exports = {
    // Core
    FlowClient,
    FlowManager: require('./core/FlowManager'),
    CommandFlow: require('./core/CommandFlow'),
    
    // Structures
    FlowCommand,
    FlowEvent,
    FlowEmbed,
    
    // Utilities
    ...require('./utilities/FlowUtils'),
    ...require('./utilities/FlowFormatters'),
    
    // Versão
    version: require('../package.json').version
};