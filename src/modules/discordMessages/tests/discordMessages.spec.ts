import supertest from 'supertest';
import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor } from '@tests/utils/records';
import * as fixtures from './fixtures';
import createApp from '@/app';

const db = await createTestDataBase();

const app = createApp(db);

const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'messageTemplates');
const createStudents = createFor(db, 'students');
const createMessages = createFor(db, 'discordMessages');

await createSprints(fixtures.sprints);
await createTemplates(fixtures.messages);
await createStudents(fixtures.students);

afterEach(async () => {
    await db.deleteFrom('discordMessages').execute();
});

describe('POST', () => {
    it('should post the message of accomplishment for a specific student', async () => {
        await supertest(app)
            .post('/congratulate')
            .send({
                studentId: 1,
                sprintId: 1,
                templateId: 1,
                url: 'http//:example.com',
            })
            .expect(201);
    });
});

describe('GET', () => {
    it('should return the list of messages', async () => {
        await createMessages({
            studentId: 1,
            sprintId: 1,
            templateId: 1,
            url: 'http//:example.com',
        });
        const { body } = await supertest(app).get('/congratulate').expect(200);
        expect(body).toHaveLength(1);
        expect(body).toEqual([
            {
                name: 'Jon Snow',
                sprintName: 'WD-1.1',
                text: 'What an achievement!!',
                url: 'http//:example.com',
                username: 'jsnow',
            },
        ]);
    });

    it('should return an empty array of all congratulatory messages for a user that does not exist', async () => {
        const response = await supertest(app)
            .get('/congratulate')
            .query({ username: 'nobody' });

        console.log(response.status);
        expect(response.body).toHaveLength(0);
    });
    it('should return an array of all congratulatory messages for a specific user', async () => {
        await createMessages({
            studentId: 1,
            sprintId: 1,
            templateId: 1,
            url: 'http//:example.com',
        });
        const { body } = await supertest(app)
            .get('/congratulate')
            .query({ username: 'jsnow' });
        expect(body).toHaveLength(1);
        expect(body).toEqual([
            {
                name: 'Jon Snow',
                text: 'What an achievement!!',
                sprintName: 'WD-1.1',
                sprintDescription:
                    'First Steps Into Programming with Python: Project',
                url: 'http//:example.com',
            },
        ]);
    });
});
