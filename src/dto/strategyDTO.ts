export default class StrategyDto {
    step;
    orderDeviation;
    orderSecondaryPairVolume;
    orderBasePairVolume;
    orderPriceToStep;
    orderAveragePrice;
    orderTargetPrice;
    orderTargetDeviation;
    summarizedOrderSecondaryPairVolume;
    summarizedOrderBasePairVolume;

    constructor(model: any) {
        this.step = model.step;
        this.orderDeviation = model.orderDeviation;
        this.orderSecondaryPairVolume = model.orderSecondaryPairVolume;
        this.orderBasePairVolume = model.orderBasePairVolume;
        this.orderPriceToStep = model.orderPriceToStep;
        this.orderAveragePrice = model.orderAveragePrice;
        this.orderTargetPrice = model.orderTargetPrice;
        this.orderTargetDeviation = model.orderTargetDeviation;
        this.summarizedOrderSecondaryPairVolume =
            model.summarizedOrderSecondaryPairVolume;
        this.summarizedOrderBasePairVolume =
            model.summarizedOrderBasePairVolume;
    }
}
