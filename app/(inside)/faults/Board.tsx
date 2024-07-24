"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Faults, Status } from "@prisma/client";
import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/uploadthing";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  board: Faults[];
}

const Board = ({ board }: Props) => {
  const [tasks, setTasks] = useState<Faults[]>(board || []);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskFile, setNewTaskFile] = useState("");

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const draggedTask = tasks.find((task) => task.id === draggableId);
    if (!draggedTask) return;

    let updatedStatus: Status;
    switch (destination.droppableId) {
      case "todo":
        updatedStatus = "TODO";
        break;
      case "inProgress":
        updatedStatus = "IN_PROGRESS";
        break;
      case "completed":
        updatedStatus = "DONE";
        break;
      default:
        updatedStatus = draggedTask.status;
    }

    try {
      axios.post("/api/updateTaskStatus", {
        taskId: draggableId,
        newStatus: updatedStatus
      });
    } catch (error) {
      console.log(error);
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return {
          ...task,
          status: updatedStatus
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const addTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/updateTaskStatus/addTask", {
        title: newTaskTitle,
        file: newTaskFile,
        status: "TODO",
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setNewTaskFile("");
      setShowAddModal(false);
      toast.success("Task added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error adding task");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        ...Loading
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        Fault Reports
        <button onClick={() => setShowAddModal(true)} className="ml-auto bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3">
            <Column
              title="Todo"
              tasks={tasks.filter((task) => task.status === "TODO")}
              droppableId="todo"
              setTasks={setTasks}
            />
            <Column
              title="In Progress"
              tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
              droppableId="inProgress"
              setTasks={setTasks}
            />
            <Column
              title="Completed"
              tasks={tasks.filter((task) => task.status === "DONE")}
              droppableId="completed"
              setTasks={setTasks}
            />
          </div>
        </DragDropContext>
      </CardContent>

      {showAddModal && (
        <Card className="fixed inset-0 flex items-center justify-center bg-black">
          <CardContent>
          <CardTitle>Add Task</CardTitle>

            <Input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border p-2 mb-4"
            />
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                setNewTaskFile(res[0].url);
                toast.success("Upload done");
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
            />
            <Button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Add
            </Button>
            <Button onClick={() => setShowAddModal(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded mt-4">
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </Card>
  );
};

export default Board;
