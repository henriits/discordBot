import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import * as schema from './schema';
import StudentNotFound from '../../utils/errors/moduleErrors/studentNotFound';

export default (db: Database) => {
    const students = buildRepository(db);
    const router = Router();

    router.get(
        '/',
        jsonRoute(async () => {
            const sprintsList = await students.findAll();
            return sprintsList;
        })
    );

    router.post(
        '/',
        jsonRoute(async (req) => {
            const body = schema.parseInsertable(req.body);
            return students.addStudent(body);
        }, StatusCodes.CREATED)
    );
    router.get(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const record = await students.findById(id);
            if (!record) {
                throw new StudentNotFound();
            }
            return record;
        })
    );
    router.patch(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const bodyPatch = schema.parseUpdatable(req.body);
            const record = await students.update(id, bodyPatch);
            if (!record) {
                throw new StudentNotFound();
            }
            return record;
        })
    );
    router.delete(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const record = await students.remove(id);
            if (!record) {
                throw new StudentNotFound();
            }
            return record;
        })
    );
    return router;
};
