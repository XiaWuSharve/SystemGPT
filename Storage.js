import { createClient } from "redis";

export class Storage {
    client;
    messages;
    constructor() {
        this.client = createClient();
        this.client.on('error', err => console.log('Redis Client Error', err));
    }

    // async connect() {
    //     await this.client.connect();
    // }

    async getAll() {
        if(this.messages) return this.messages;
        await this.client.connect();
        const lst = await this.client.lRange('messages', -7, -1);
        let res = lst.map(str => JSON.parse(str));
        await this.client.disconnect();
        this.messages = res;
        return res;
    }

    async addOne(role, message) {
        const data = { role, content: message };
        this.messages.push(data);
        await this.client.connect();
        await this.client.rPush('messages', JSON.stringify(data));
        await this.client.disconnect();
    }
}