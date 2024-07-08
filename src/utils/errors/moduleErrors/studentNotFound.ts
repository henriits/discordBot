import NotFound from '@/utils/errors/NotFound';

export default class StudentNotFound extends NotFound {
    constructor(message = 'Student not found') {
        super(message);
    }
}
