import React from "react";
import TasksPanel from "../tasks/TasksPanel";
import Calendar from "../calendar/Calendar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <main className="flex-1">
        <Calendar />
      </main>

      <aside className="w-80 border-l overflow-y-auto">
        <TasksPanel />
      </aside>
    </div>
  );
};

export default Dashboard;
