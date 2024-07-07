import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor } from '@tests/utils/records';
import buildRepository from '../repository';
import * as fixtures from './fixtures';

const db = await createTestDataBase();
const repository = buildRepository(db);
const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'messageTemplates');
const createStudents = createFor(db, 'students');

await createSprints(fixtures.sprints);
await createTemplates(fixtures.messages);
await createStudents(fixtures.students);

afterEach(() => {
    vi.restoreAllMocks();
});

let url = '';
const gif = {
    fetchGif: () => 'http//:example.com',
};

const spy = vi.spyOn(gif, 'fetchGif').mockImplementation(() => url);
url = 'http//:example.com';

describe('create', () => {
    it('should create accomplishment', async () => {
        await repository.create({
            studentId: 1,
            sprintId: 1,
            templateId: 1,
            url: gif.fetchGif(),
        });

        const accomplishment = await repository.getPostInfo(1);
        expect(spy).toHaveBeenCalled();
        expect(accomplishment).toHaveLength(1);
        expect(accomplishment).toEqual([
            {
                text: 'What an achievement!!',
                sprintName: 'WD-1.1',
                sprintDescription:
                    'First Steps Into Programming with Python: Project',
                username: 'jsnow',
                name: 'Jon Snow',
                url: 'http//:example.com',
            },
        ]);
    });
});

describe('getPostInfo', () => {
    it('should return information about a specific student', async () => {
        const accomplishment = await repository.getPostInfo(1);
        expect(accomplishment).toHaveLength(1);
        expect(accomplishment).toEqual([
            {
                text: 'What an achievement!!',
                sprintName: 'WD-1.1',
                sprintDescription:
                    'First Steps Into Programming with Python: Project',
                username: 'jsnow',
                name: 'Jon Snow',
                url: 'http//:example.com',
            },
        ]);
    });
});

describe('getUserMessages', () => {
    it('return the information about user by providing a username', async () => {
        const accomplishment = await repository.getUserMessages('jsnow');
        expect(accomplishment).toEqual([
            {
                name: 'Jon Snow',
                sprintName: 'WD-1.1',
                sprintDescription:
                    'First Steps Into Programming with Python: Project',
                text: 'What an achievement!!',
                url: 'http//:example.com',
            },
        ]);
    });

    it('returns an empty array if the user is not found', async () => {
        const accomplishment = await repository.getUserMessages('Bob');
        expect(accomplishment).toHaveLength(0);
    });
});

describe('getSprintMessages', () => {
    it('returns the information by providing a sprint name', async () => {
        const accomplishment = await repository.getSprintMessages('WD-1.1');
        expect(accomplishment).toEqual([
            {
                name: 'Jon Snow',
                sprintName: 'WD-1.1',
                sprintDescription:
                    'First Steps Into Programming with Python: Project',
                text: 'What an achievement!!',
                url: 'http//:example.com',
            },
        ]);
        expect(accomplishment).toHaveLength(1);
    });

    it('returns an empty array if there are no messages for the provided sprint name', async () => {
        const accomplishment = await repository.getSprintMessages('WD-1.2');
        expect(accomplishment).toEqual([]);
    });
});
