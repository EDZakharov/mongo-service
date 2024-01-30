export default class ApiKeysDto {
    id;
    exchange;
    apiKey;
    apiSecretKey;

    constructor(model: any) {
        this.id = model.id;
        this.exchange = model.exchange;
        this.apiKey = model.apiKey;
        this.apiSecretKey = model.apiSecretKey;
    }
}
