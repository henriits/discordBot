import supertest from 'supertest';
import createTestDataBase from '@tests/utils/createTestDataBase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import { templatesFactory, templatesMatcher } from './utils';

const db = await createTestDataBase();

const app = createApp(db);

const createTemplates = createFor(db, 'messageTemplates');

afterAll(() => db.destroy());

afterEach(async () => {
    await db.deleteFrom('messageTemplates').execute();
});

describe('GET', () => {
    it('should return an empty array of message templates when there are no templates', async () => {
        const { body } = await supertest(app).get('/templates').expect(200);
        expect(body).toHaveLength(0);
    });

    it('should return a list of message templates', async () => {
        await createTemplates([
            templatesFactory(),
            templatesFactory({ text: 'You did it!' }),
        ]);

        const { body } = await supertest(app).get('/templates').expect(200);

        expect(body).toEqual([
            templatesMatcher(),
            templatesMatcher({ text: 'You did it!' }),
        ]);
    });
});

describe('GET :id', () => {
    it('should return 404 if the message is not found', async () => {
        const { body } = await supertest(app).get('/templates/999').expect(404);
        expect(body.error.message).toMatch('Message not found');
    });

    it('should return a template if it exists', async () => {
        await createTemplates([
            templatesFactory({
                id: 1234,
            }),
        ]);

        const { body } = await supertest(app)
            .get('/templates/1234')
            .expect(200);
        expect(body).toEqual(templatesMatcher({ id: 1234 }));
    });
});

describe('POST ', () => {
    it('should return 201 and create a message template', async () => {
        const { body } = await supertest(app)
            .post('/templates')
            .send(
                templatesFactory({
                    text: 'Good job',
                })
            )
            .expect(201);

        expect(body).toEqual(templatesMatcher({ text: 'Good job' }));
    });

    it('should return 400 if text is missing in the request', async () => {
        const { body } = await supertest(app)
            .post('/templates')
            .send({})
            .expect(400);

        expect(body.error.message).toMatch(/text/i);
    });

    it('should return 405 for unsupported methods on /templates', async () => {
        await supertest(app).put('/templates').expect(405);
        await supertest(app).delete('/templates').expect(405);
    });
});

describe('PATCH:id', () => {
    it('should return 404 if the message is not found', async () => {
        const { body } = await supertest(app)
            .patch('/templates/999')
            .send({ text: 'Updated text!' })
            .expect(404);

        expect(body.error.message).toMatch('Message not found');
    });

    it('should return 200 and update text', async () => {
        const id = 888;
        await createTemplates([templatesFactory({ id })]);

        await supertest(app)
            .patch(`/templates/${id}`)
            .send({ text: 'Updated text!' })
            .expect(200);

        const { body } = await supertest(app)
            .get(`/templates/${id}`)
            .expect(200);
        expect(body).toEqual(templatesMatcher({ id, text: 'Updated text!' }));
    });

    it('should return 405 for unsupported methods on /templates/:id', async () => {
        await supertest(app).put('/templates/1234').expect(405);
    });
});

describe('DELETE :id', () => {
    it('should delete the template by provided id', async () => {
        const id = 1234;
        await createTemplates([templatesFactory({ id })]);
        await supertest(app).delete(`/templates/${id}`).expect(200);
    });

    it('should return 404 if template is not found', async () => {
        await supertest(app).delete('/templates/999').expect(404);
    });

    it('should return 405 for unsupported methods on /templates/:id', async () => {
        await supertest(app).put('/templates/1234').expect(405);
    });
});
