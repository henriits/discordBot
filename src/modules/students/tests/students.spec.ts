import supertest from 'supertest';
import { omit } from 'lodash/fp';
import { createFor } from '@tests/utils/records';
import createTestDataBase from '@tests/utils/createTestDataBase';
import createApp from '@/app';
import { studentsFactory, studentsMatcher } from './utils';

const db = await createTestDataBase();

const app = createApp(db);
const createStudents = createFor(db, 'students');

afterAll(() => db.destroy());
afterEach(async () => {
    await db.deleteFrom('students').execute();
});

describe('GET', () => {
    it('should return an empty list if there are no students', async () => {
        const { body } = await supertest(app).get('/students').expect(200);
        expect(body).toHaveLength(0);
    });

    it('should return a list of the existing students', async () => {
        await createStudents([
            studentsFactory(),
            studentsFactory({ name: 'Jon Snow', username: 'jsnow' }),
        ]);
        const { body } = await supertest(app).get('/students').expect(200);
        expect(body).toHaveLength(2);
    });

    it('should return 404 if student is not found', async () => {
        const { body } = await supertest(app).get('/students/999').expect(404);
        expect(body.error.message).toMatch('Student not found');
    });
});

describe('POST', () => {
    it('returns 400 if username is missing', async () => {
        const { body } = await supertest(app)
            .post('/students')
            .send(omit(['username'], studentsFactory({})))
            .expect(400);

        expect(body.error.message).toMatch(/username/i);
    });

    it('returns 400 if name is missing', async () => {
        const { body } = await supertest(app)
            .post('/students')
            .send(omit(['name'], studentsFactory({})))
            .expect(400);

        expect(body.error.message).toMatch(/name/i);
    });

    it('should return 201 and create a student', async () => {
        const { body } = await supertest(app)
            .post('/students')
            .send(
                studentsFactory({
                    name: 'Jon Snow',
                    username: 'jsnow',
                })
            )
            .expect(201);

        expect(body).toEqual(
            studentsMatcher({ name: 'Jon Snow', username: 'jsnow' })
        );
    });
});

describe('PATCH', () => {
    it('should return 404 if student is not found', async () => {
        const { body } = await supertest(app)
            .patch('/students/999')
            .send({ name: 'bob' })
            .expect(404);
        expect(body.error.message).toMatch('Student not found');
    });

    it('should return 200 and update name', async () => {
        const id = 999;
        await createStudents([studentsFactory({ id })]);
        await supertest(app)
            .patch(`/students/${id}`)
            .send({ name: 'bob' })
            .expect(200);
        const { body } = await supertest(app).get('/students/999').expect(200);
        expect(body).toEqual(studentsMatcher({ id, name: 'bob' }));
    });

    it('allows fully updating the student', async () => {
        const id = 1234;
        await createStudents([studentsFactory({ id })]);
        const { body } = await supertest(app)
            .patch(`/students/${id}`)
            .send({ name: 'Updated Name', username: 'updatedusername' })
            .expect(200);
        expect(body).toEqual(
            studentsMatcher({
                id,
                name: 'Updated Name',
                username: 'updatedusername',
            })
        );
    });

    it('should return the student without changes if no fields are provided', async () => {
        const id = 1234;
        const student = studentsFactory({ id });
        await createStudents([student]);
        const { body } = await supertest(app)
            .patch(`/students/${id}`)
            .send({})
            .expect(200);
        expect(body).toEqual(studentsMatcher(student));
    });
});

describe('DELETE', () => {
    it('should delete the student by provided id', async () => {
        const id = 1234;
        await createStudents([studentsFactory({ id })]);
        await supertest(app).delete(`/students/${id}`).expect(200);
    });

    it('returns 404 if student is not found when deleting', async () => {
        await supertest(app).delete('/students/999').expect(404);
    });
});
