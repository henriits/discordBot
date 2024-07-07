import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import { Client } from 'discord.js';
import type { Database } from '@/database';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import buildRepository from './repository';
import { createChannel } from '@/utils/createChannel';
import sendMessage from '@/discord/sendMessage';
import * as schema from './schema';
import fetchGif from '@/utils/fetchGif';
import buildTemplateRepository from '../messageTemplates/repository';

const { DISCORD_CHANNEL_ID } = process.env;

export default (db: Database, bot?: Client) => {
    const router = Router();
    const messages = buildRepository(db);
    const templates = buildTemplateRepository(db);

    router.post(
        '/',
        jsonRoute(async (req) => {
            try {
                const body = schema.parseInsertable(req.body);
                const randomId = await templates.findRandomId();
                if (!randomId) {
                    throw new Error();
                }
                const { id: randomTemplateId } = randomId;
                const url = await fetchGif();
                if (!url) {
                    throw new Error();
                }

                const record = {
                    ...body,
                    templateId: randomTemplateId,
                    url,
                };

                await messages.create(record);

                const studentId = schema.parseId(body.studentId);
                const records = await messages.getPostInfo(studentId);

                const channel = await createChannel(bot, DISCORD_CHANNEL_ID);

                await sendMessage(channel, records);

                return { message: 'Accomplishment created successfully.' };
            } catch (error) {
                console.log(error);
                return error;
            }
        }, StatusCodes.CREATED)
    );

    router.get(
        '/',
        jsonRoute(async (req) => {
            const { username, sprint } = req.query;

            if (typeof username === 'string') {
                return messages.getUserMessages(username as string);
            }
            if (typeof sprint === 'string') {
                return messages.getSprintMessages(sprint as string);
            }

            const allMessages = await messages.getAllMessages();
            return allMessages;
        }, StatusCodes.OK)
    );
    router.route('/').patch(unsupportedRoute);
    router.route('/').delete(unsupportedRoute);
    return router;
};
