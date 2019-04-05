const config = require(`${require('os').homedir()}/taikoconfig.json`);

module.exports = class Util {
    static rpcStatus(timestamp, content, optional) {
        if (!optional) {
            const status = {
                pid: process.pid,
                activity: {
                    details: `Playing on ${config.url}`,
                    state: content,
                    timestamps: { start: timestamp },
                    assets: {
                        large_image: 'background',
                        large_text: 'Taiko Desktop'
                    },
                    instance: false
                }
            }
            return status;
        }
        const status = {
            pid: process.pid,
            activity: {
                details: `Playing on ${config.url}`,
                state: content,
                timestamps: { start: timestamp },
                assets: {
                    large_image: 'background',
                    large_text: 'Taiko Desktop',
                    small_image: optional,
                    small_text: optional[0].toUpperCase() + optional.substr(1)
                },
                instance: false
            }
        }
        return status;
    }
}