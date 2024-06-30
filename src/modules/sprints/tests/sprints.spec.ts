import supertest from 'supertest';
import { omit } from 'lodash/fp';
import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import { sprintsFactory, sprintsMatcher } from './utils';

const db = await createTestDataBase();

const app = createApp(db);
const createSprints = createFor(db, 'sprints');

afterEach(async () => {
    await db.deleteFrom('sprints').execute();
});
afterAll(() => db.destroy());

describe('GET', () => {
    it('should return an empty array of sprints when there are no sprit', async () => {
        const { body } = await supertest(app).get('/sprints').expect(200);
        expect(body).toHaveLength(0);
    });

    it('should return a list of existing sprints', async () => {
        await createSprints([
            sprintsFactory(),
            sprintsFactory({
                sprintName: 'WD_1.1',
                sprintDescription: 'starting with python',
            }),
        ]);
        const { body } = await supertest(app).get('/sprints').expect(200);
        expect(body).toEqual([
            sprintsMatcher(),
            sprintsMatcher({
                sprintName: 'WD_1.1',
                sprintDescription: 'starting with python',
            }),
        ]);
    });
});

describe('GET/:id', () => {
    it('should return 404 if sprint does not exist', async () => {
        const { body } = await supertest(app).get('/sprints/999').expect(404);
        expect(body.error.message).toEqual('Sprint not found');
    });

    it('should return a sprint if exists', async () => {
        await createSprints([
            sprintsFactory({
                id: 123,
            }),
        ]);
        const { body } = await supertest(app).get('/sprints/123').expect(200);
        expect(body).toEqual(
            sprintsMatcher({
                id: 123,
            })
        );
    });
});

describe('POST', () => {
    it('it will return an error if sprintName is missing', async () => {
        await supertest(app)
            .post('/sprints')
            .send(omit(['sprintName'], sprintsFactory({})))
            .expect(400);
    });
    it('it will return an error if sprintDescription is missing', async () => {
        await supertest(app)
            .post('/sprints')
            .send(omit(['sprintDescription'], sprintsFactory({})))
            .expect(400);
    });

    it('it is not allowed to create a sprint with empty sprintName', async () => {
        await supertest(app)
            .post('/sprints')
            .send(sprintsFactory({ sprintName: '' }))
            .expect(400);
    });

    it('return 201 when the sprint is created', async () => {
        const { body } = await supertest(app)
            .post('/sprints')
            .send({
                sprintName: 'WD-1.4',
                sprintDescription: 'Computer Science Fundamentals: Project',
            })
            .expect(201);
        expect(body).toEqual({
            id: expect.any(Number),
            sprintName: 'WD-1.4',
            sprintDescription: 'Computer Science Fundamentals: Project',
        });
    });
});

describe('PATCH', () => {
    it('should return 404 if sprint does not exist', async () => {
        const { body } = await supertest(app)
            .patch('/sprints/999')
            .send({
                sprintName: 'WD-1.4',
                sprintDescription: 'Computer Science Fundamentals: Project',
            })
            .expect(404);
        expect(body.error.message).toEqual('Sprint not found');
    });

    it('it allows partial update', async () => {
        const id = 1234;
        await createSprints([sprintsFactory({ id })]);
        const { body } = await supertest(app)
            .patch(`/sprints/${1234}`)
            .send({ sprintDescription: 'Updated' });
        expect(200);
        expect(body).toEqual(
            sprintsMatcher({
                id,
                sprintDescription: 'Updated',
            })
        );
    });

    it('it allows fully update the sprint', async () => {
        const id = 1234;
        await createSprints([sprintsFactory({ id })]);
        const { body } = await supertest(app)
            .patch(`/sprints/${1234}`)
            .send({ sprintName: 'WD-1.4', sprintDescription: 'Updated' });
        expect(200);
        expect(body).toEqual(
            sprintsMatcher({
                id,
                sprintName: 'WD-1.4',
                sprintDescription: 'Updated',
            })
        );
    });
});

describe('DELETE', () => {
    it('it delete the sprint by provided id', async () => {
        const id = 1234;
        await createSprints([sprintsFactory({ id })]);
        await supertest(app).delete('/sprints/1234').expect(200);
    });
    it('returns 404 if sprint is not found', async () => {
        const id = 1234;
        await createSprints([sprintsFactory({ id })]);
        await supertest(app).delete('/sprints/999').expect(404);
    });
});
