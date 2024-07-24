import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Faults, FaultDetails } from "@prisma/client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { SetStateAction, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/components/uploadthing";
import { toast } from "sonner";

interface Props {
  title: string;
  tasks: Faults[];
  droppableId: string;
  setTasks: React.Dispatch<React.SetStateAction<Faults[]>>;
}

const Column = ({ title, tasks, droppableId, setTasks }: Props) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>("");
  const [editTaskFile, setEditTaskFile] = useState<string>("");
  const [newDetail, setNewDetail] = useState<string>("");
  const [taskDetails, setTaskDetails] = useState<{ [key: string]: FaultDetails[] }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsPromises = tasks.map((task) =>
          axios.get(`/api/faultDetails/${task.id}`)
        );
        const detailsResponses = await Promise.all(detailsPromises);
        const detailsMap: { [key: string]: FaultDetails[] } = {};
        detailsResponses.forEach((response, index) => {
          detailsMap[tasks[index].id] = response.data;
        });
        setTaskDetails(detailsMap);
      } catch (error) {
        console.error("Error fetching fault details", error);
      }
    };
    fetchDetails();
  }, [tasks]);

  const deleteTask = async (taskId: string) => {
    try {
      await axios.post("/api/updateTaskStatus/deleteTask", { taskId });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting task");
    }
  };

  const editTask = async () => {
    if (!editTaskId) {
      toast.error("No task selected for editing");
      return;
    }
  
    try {
      const response = await axios.post("/api/updateTaskStatus/editTask", {
        taskId: editTaskId,
        title: editTaskTitle,
        file: editTaskFile,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId ? { ...task, title: editTaskTitle, file: editTaskFile } : task
        )
      );
  
      if (newDetail) {
        await axios.post("/api/updateTaskStatus/addFaultDetail", {
          faultId: editTaskId,
          description: newDetail,
        });
        const updatedDetails = await axios.get(`/api/faultDetails/${editTaskId}`);
        setTaskDetails((prevDetails) => ({
          ...prevDetails,
          [editTaskId]: updatedDetails.data,
        }));
      }
  
      setEditTaskId(null);
      setEditTaskTitle("");
      setEditTaskFile("");
      setNewDetail("");
      toast.success("Task edited successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error editing task");
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search faults..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} index={index} draggableId={task.id}>
                  {(provided) => (
                    <div
                      className="flex flex-col p-2 border rounded"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <div className="flex flex-col justify-between items-center">
                        <p>{task.title}</p>
                        <img src={task.file} alt="task file" className="w-full m-2 rounded-xl"/>
                          <div className="flex gap-5">
                            <div className="text-xs cursor-pointer" onClick={() => { setEditTaskId(task.id); setEditTaskTitle(task.title); setEditTaskFile(task.file); }}>
                              Edit
                            </div>
                            <div className="text-xs cursor-pointer" onClick={() => deleteTask(task.id)}>
                              Delete
                            </div>
                          </div>
                      </div>
                      <div className="mt-2">
                        Logs:
                        {taskDetails[task.id]?.map((detail) => (
                          <div key={detail.id} className="text-sm text-gray-600">
                            {detail.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>

      {editTaskId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <h2>Edit Task</h2>
            <Input
              type="text"
              placeholder="Task Title"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
              className="border p-2 mb-4"
            />
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                setEditTaskFile(res[0].url);
                toast.success("Upload done");
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
            />
            <Input
              placeholder="Add fault detail"
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              className="border p-2 mb-4"
            />
            <Button onClick={editTask} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Save
            </Button>
            <Button onClick={() => setEditTaskId(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded mt-4">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Column;
