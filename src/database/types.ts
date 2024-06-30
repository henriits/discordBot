import type { ColumnType } from 'kysely';

export type Generated<T> =
    T extends ColumnType<infer S, infer I, infer U>
        ? ColumnType<S, I | undefined, U>
        : ColumnType<T, T | undefined, T>;

export interface Sprints {
    id: Generated<number>;
    sprintDescription: string;
    sprintName: string;
}

export interface Students {
    id: Generated<number>;
    name: string;
    username: string;
}

export interface DB {
    sprints: Sprints;
    students: Students;
}
