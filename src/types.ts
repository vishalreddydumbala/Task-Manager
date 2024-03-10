export type Id = string;

export type Column = {
    id: Id,
    title: string,
}

export type Task = {
    id: Id,
    title: string,
    columnId: Id,
}