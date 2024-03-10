import { useState } from "react";
import { Task } from "../types"
import { DeleteIcon } from "../icons/DeleteIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

interface Props {
    task: Task;
    deleteTask: (id: string) => void;
    updateTask: (id: string, title: string) => void;
}

const TaskCard = (props: Props) => {
    const [isHover, setIshover] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setIshover(false);
    }
    const {task, deleteTask, updateTask} = props;


    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };



    if(editMode) {
        return (
            <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="p-2.5 h-70px min-h-[70px] flex items-center justify-between text-left rounded-xl hover:ring-2 hover:ring-black">
                <textarea className="w-full h-full resize-none focus:outline-none" defaultValue={props.task.title} onBlur={toggleEditMode} onKeyDown={(e)=>{
                    if(e.key === 'Enter'){
                        toggleEditMode();
                    }
                
                }}

                onChange={(e)=>{updateTask(task.id, e.target.value)}}
                 />
            </div>
        )
    }

    return (
        <div className="p-2.5 h-70px min-h-[70px] flex items-center justify-between text-left rounded-xl hover:ring-2 hover:ring-black" onMouseOver={() => setIshover(true)} onMouseLeave={()=>setIshover(false)} onClick={toggleEditMode}>
            {task.title}
            {isHover && <button onClick={()=>{deleteTask(task.id)}}><DeleteIcon /></button>}
        </div>
    )
}
export default TaskCard
