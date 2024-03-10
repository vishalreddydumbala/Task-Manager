import { useMemo, useState } from "react";
import AddIcon from "../icons/AddIcon"
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";

const Board = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns])

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3,
        },
    }));

    const createColumn = () => {
        const columnToAdd: Column = {
            id: Math.floor(Math.random() * 1000).toString(),
            title: "New Column"
        }

        setColumns([...columns, columnToAdd])
    }

    const deleteColumn = (id: Id) => {
        setColumns(columns.filter(column => column.id !== id))
    }

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
        }
    }

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(column => column.id === activeColumnId);
            const overColumnIndex = columns.findIndex(column => column.id === overColumnId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    }

    const updateColumn = (id:Id, title: string) => {
        const newColumns = columns.map(column => {
            if(column.id !== id) return column;
            return {...column, title};
        });

        setColumns(newColumns);
    }

    const createTask = (columnId: Id) => () => {
        const newTask : Task = {
            id: Math.floor(Math.random() * 1000).toString(),
            title: "New Task",
            columnId,
        }

        setTasks([...tasks, newTask])
    }

    const deleteTask = (id: Id) => {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
    }

    const updateTask = (id: Id, title: string) => {
        const newTasks = tasks.map(task => {
            if(task.id !== id) return task;
            return {...task, title};
        });

        setTasks(newTasks);
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
                <div className="m-auto flex gap-4">
                    <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <ColumnContainer column={column} key={column.id} deleteColumn={deleteColumn} updateColumn = { updateColumn} createTask = {createTask} deleteTask={deleteTask} tasks = {tasks.filter((task)=> task.columnId===column.id)} updateTask={updateTask}/>
                        ))}
                    </SortableContext>
                    <button onClick={createColumn} className="h-[60px] w-[300px] min-w-[200px] cursor-pointer rounded-lg border-2 border-black p-4 hover:ring-2 flex justify-between">
                        Column
                        <AddIcon />
                    </button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn = { updateColumn} createTask = {createTask} deleteTask={deleteTask} tasks = {tasks.filter((task)=> task.columnId===activeColumn.id)} updateTask={updateTask}/>}
                </DragOverlay>, document.body)}
            </DndContext>
        </div>
    )
}
export default Board