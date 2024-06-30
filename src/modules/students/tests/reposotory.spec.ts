import supertest from 'supertest';

import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { studentsFactory, studentsMatcher } from './utils';
import createApp from '@/app';
import buildRepository from '../repository';

const db = await createTestDataBase();
const app = createApp(db);
const repository = buildRepository(db);
const createStudents = createFor(db, 'students');
const selectStudents = selectAllFor(db, 'students');

afterAll(() => db.destroy());

afterEach(async () => {
    await db.deleteFrom('students').execute();
});

describe('POST', () => {
    it('should add a student', async () => {
        const student = await repository.addStudent(studentsFactory());
        expect(student).toEqual(studentsMatcher());

        const studentInDataBase = await selectStudents();
        expect(studentInDataBase).toEqual([student]);
    });
});

describe('GET', () => {
    it('should return a list of all students', async () => {
        await createStudents([
            studentsFactory({ name: 'Jon Snow', username: 'jsnow' }),
            studentsFactory({ name: 'Bobby Bob', username: 'bbob' }),
        ]);
        const students = await repository.findAll();
        expect(students).toHaveLength(2);
        expect(students[0]).toEqual(
            studentsMatcher({ name: 'Jon Snow', username: 'jsnow' })
        );
        expect(students[1]).toEqual(
            studentsMatcher({ name: 'Bobby Bob', username: 'bbob' })
        );
    });
    it('should return an empty array of sprints when there are no sprit', async () => {
        const { body } = await supertest(app).get('/students').expect(200);
        expect(body).toHaveLength(0);
    });
});

describe('GET/:id', () => {
    it('should return a student if exist', async () => {
        await createStudents([
            studentsFactory({
                id: 123,
            }),
        ]);
        const { body } = await supertest(app).get('/students/123').expect(200);
        expect(body).toEqual(
            studentsMatcher({
                id: 123,
            })
        );
    });
    it('should return 404 if student does not exist', async () => {
        const { body } = await supertest(app).get('/students/999').expect(404);
        expect(body.error.message).toEqual('Student not found');
    });
});
