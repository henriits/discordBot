import NotFound from '@/utils/errors/NotFound';

export default class MessageNotFound extends NotFound {
    constructor(message = 'Message not found') {
        super(message);
    }
}
