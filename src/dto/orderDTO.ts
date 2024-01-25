export default class StrategyDto {
    userId;
    coin;
    side;
    orderId;
    orderLinkId;
    createdAt;
    updatedAt;

    constructor(model: any) {
        this.userId = model.userId;
        this.coin = model.coin;
        this.side = model.side;
        this.orderId = model.orderId;
        this.orderLinkId = model.orderLinkId;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}
