import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { studentsFactory, studentsMatcher } from './utils';
import buildRepository from '../repository';

const db = await createTestDataBase();
const repository = buildRepository(db);
const createStudents = createFor(db, 'students');
const selectStudents = selectAllFor(db, 'students');

afterAll(() => db.destroy());

afterEach(async () => {
    await db.deleteFrom('students').execute();
});

describe('addStudent', () => {
    it('should add a student', async () => {
        const student = await repository.addStudent(studentsFactory());
        expect(student).toEqual(studentsMatcher());

        const studentInDataBase = await selectStudents();
        expect(studentInDataBase).toEqual([student]);
    });
});

describe('findAll', () => {
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
});
