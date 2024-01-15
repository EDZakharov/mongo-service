import { Request, Response } from 'express';
import CurrentStepDto from '../dto/currentStepDTO';
import { CurrentStepModel } from '../models/currentStepModel';

interface IStep {
    id?: string;
    step?: number;
    coin?: string;
}

export const getCurrentStep = async (req: Request, res: Response) => {
    try {
        const { id, coin }: IStep = req.query;

        if (!id || !coin) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }
        const currentStep = await CurrentStepModel.findOne({ id, coin });
        if (!currentStep) {
            return res.status(404).json({
                message: 'Step not found',
                success: false,
            });
        }

        const stepDto = new CurrentStepDto(currentStep);

        return res.status(200).json({
            message: 'Step found',
            success: true,
            ...stepDto,
        });
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to find step',
            success: false,
        });
    }
};

export const setCurrentStep = async (req: Request, res: Response) => {
    try {
        const { id, step, coin }: IStep = req.query;
        if (!id || !step || !coin) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }

        const currentStep = await CurrentStepModel.findOne({ id, coin });
        if (!currentStep) {
            await CurrentStepModel.create({ id, step, coin });
        } else {
            await CurrentStepModel.findOneAndUpdate(
                { id, coin },
                {
                    step,
                }
            );
            return res.status(200).json({
                message: 'Step was updated',
                success: true,
            });
        }

        return res.status(201).json({
            message: 'Step was created',
            success: true,
        });
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to set step',
            success: false,
        });
    }
};

export const deleteCurrentStep = async (req: Request, res: Response) => {
    try {
        const { id, coin }: IStep = req.query;

        if (!id || !coin) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }

        const currentStep = await CurrentStepModel.deleteOne({ id, coin });
        if (!currentStep) {
            return res.status(404).json({
                message: 'Step not found',
                success: false,
            });
        }
        return res.status(200).json({
            ...currentStep,
            message: 'Step was deleted',
            success: true,
        });
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to delete step',
            success: false,
        });
    }
};
