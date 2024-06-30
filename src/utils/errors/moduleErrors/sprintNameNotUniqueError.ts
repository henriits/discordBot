import { StatusCodes } from 'http-status-codes';

export default class SprintNameNotUnique extends Error {
    status: number;

    constructor(message = 'Sprint name must be unique') {
        super(message);
        this.status = StatusCodes.BAD_REQUEST;
    }
}
