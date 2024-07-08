import { TextChannel, EmbedBuilder, Channel } from 'discord.js';

export type Record = {
    name: string;
    username: string;
    sprintName: string;
    sprintDescription: string;
    text: string;
    url: string;
};

export default async function sendMessage(
    channel: Channel | undefined,
    records: Record[]
) {
    if (!channel || !(channel instanceof TextChannel)) {
        console.warn('Invalid channel provided for sending messages.');
        return;
    }

    const formattedMessage = formatTheMessage(records);

    const myEmbed = new EmbedBuilder()
        .setTitle(`Congratulations to ${records[0].name}!`)
        .setDescription(formattedMessage)
        .setImage(records[0].url)
        .setTimestamp();

    try {
        await channel.send({ embeds: [myEmbed] });
        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

export function formatTheMessage(records: Record[]) {
    const formattedMessages = records.map(
        (record) =>
            `@${record.username} has just completed ${record.sprintName}! ${record.sprintDescription}\n${record.text}`
    );
    const formattedMessage = formattedMessages.join('\n\n');

    return formattedMessage;
}
