export default class CurrentStepDto {
    id;
    step;
    coin;

    constructor(model: any) {
        this.id = model.id;
        this.step = model.step;
        this.coin = model.coin;
    }
}
