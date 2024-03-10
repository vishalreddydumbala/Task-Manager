import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { AddUnRoundedIcon } from '../icons/AddIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { Column, Id, Task } from '../types';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import TaskCard from './TaskCard';

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    createTask: (columnId: Id) => () => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, title: string) => void;
    tasks: Task[];
}

const ColumnContainer = (props: Props) => {
    const { column, deleteColumn,updateColumn, createTask,tasks,deleteTask, updateTask } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return <div className='w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-black border-2' ref={setNodeRef} style={style}>

        </div>
    }   

    return (
        <div className='w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col' ref={setNodeRef} style={style}>
            {/* {Column Title} */}
            <div {...attributes} {...listeners} className='
            h-[60px]
            text-md
            cursor-grab
            rounded-md
            font-bold
            flex
            items-center
            justify-between
            '

            >
                <div className='flex items-center ' onClick={()=>{setEditMode(true)}}>
                    <div className='bg-red-100 p-1 rounded-lg'>
                        {!editMode && column.title}
                        {editMode &&
                            <input type='text'
                                className='border-black border-2 focus:border-black focus:outline-none rounded-md p-1 w-[200px] h-[30px] text-md font-bold'
                                value={column.title}
                                onChange={(e) => updateColumn(column.id, e.target.value)}
                                autoFocus onBlur={() => setEditMode(false)}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    setEditMode(false);
                                }} />}
                    </div>
                    <div className='p-2 text-slate-600'>0</div>
                </div>
                <button onClick={() => { deleteColumn(column.id) }} className='p-3 stroke-gray-600'><DeleteIcon /></button>
            </div>
            {/* {Cloumn task Manager} */}
            <div className='flex flex-grow-0 flex-col gap-4 p-2 overflox-xx-hodden overflow-y-auto'>
                <SortableContext items={tasksIds}>
                {
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))
                }
                </SortableContext>
            </div>
            {/* {footer} */}
            <div>
                <button className='w-full h-12 rounded-b-md flex items-center justify-start' onClick={createTask(column.id)}>
                    <AddUnRoundedIcon color='#544c4b' />
                    <div className='ml-2'>New</div>
                </button>
            </div>

        </div>
    )
}
export default ColumnContainer