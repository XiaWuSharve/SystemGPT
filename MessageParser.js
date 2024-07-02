export class MessageParser {
    static parse(str) {
        return str.split(/[\r\n;]/);
    }

    static toLine(message) {
        if (typeof message === 'object' && message.constructor === Array)
            return message.join(';');
        if (typeof message === 'string')
            return message.replaceAll(/[\n\r]/g, ';');
        throw Error(`unknown type of ${message}`);
    }
}