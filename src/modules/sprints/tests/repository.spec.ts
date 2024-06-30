import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { sprintsFactory, sprintsMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDataBase();
const repository = buildRepository(db);
const app = createApp(db);

const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterAll(() => db.destroy());
afterEach(async () => {
    await db.deleteFrom('sprints').execute();
});

describe('GET', () => {
    it('should return a list of sprints', async () => {
        await createSprints([
            sprintsFactory({
                sprintName: 'WD-1.1',
            }),
            sprintsFactory({
                sprintName: 'WD-1.2',
            }),
        ]);
        const sprints = await repository.findAll();
        expect(sprints).toHaveLength(2);
        expect(sprints[0]).toEqual(sprintsMatcher({ sprintName: 'WD-1.1' }));
        expect(sprints[1]).toEqual(sprintsMatcher({ sprintName: 'WD-1.2' }));
    });
});

describe('GET/:id', () => {
    it('should return a sprint by id', async () => {
        const [sprint] = await createSprints(
            sprintsFactory({
                id: 123,
            })
        );
        const foundSprint = await repository.findById(sprint.id);
        expect(foundSprint).toEqual(sprintsMatcher());
    });
});

describe('PATCH/:id', () => {
    it('should update a sprint', async () => {
        const [sprint] = await createSprints(sprintsFactory());
        const updatedSprint = await repository.update(sprint.id, {
            sprintName: 'Updated SprintName',
        });
        expect(updatedSprint).toEqual(
            sprintsMatcher({ sprintName: 'Updated SprintName' })
        );
    });

    it('should return an original sprint if no changes are made', async () => {
        const [sprint] = await createSprints(sprintsFactory());

        const updatedSprint = await repository.update(sprint.id, {});
        expect(updatedSprint).toMatchObject(sprintsMatcher());
    });

    it('should return undefined if sprint is not found', async () => {
        const updatedSprint = await repository.update(999, {
            sprintName: 'Updated SprintName',
        });
        expect(updatedSprint).toBeUndefined();
    });
});

describe('DELETE', () => {
    it('should remove a sprint', async () => {
        const [sprint] = await createSprints(sprintsFactory());
        const removedSprint = await repository.remove(sprint.id);
        expect(removedSprint).toEqual(sprintsMatcher());
    });
    it('should return underfined if sprint is not found', async () => {
        const removedSprint = await repository.remove(123);
        expect(removedSprint).toBeUndefined();
    });
});

describe('POST', () => {
    it('should create a sprint', async () => {
        const sprint = await repository.addSprint(sprintsFactory());
        expect(sprint).toEqual(sprintsMatcher());
        const sprintInDataBase = await selectSprints();
        expect(sprintInDataBase).toEqual([sprint]);
    });
    it('should return 400 if sprint already exists', async () => {
        await createSprints([
            sprintsFactory({
                sprintName: 'WD-1.1',
            }),
        ]);

        const response = await supertest(app)
            .post('/sprints')
            .send({
                sprintName: 'WD-1.1',
                sprintDescription: 'Test Description',
            })
            .expect(StatusCodes.BAD_REQUEST);

        expect(response.body.error.message).toEqual(
            'Sprint name must be unique'
        );
    });
});
