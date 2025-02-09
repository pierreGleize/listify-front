import TodosView from "@/components/todo/TodosView";
import HomeLayout from "@/components/layout/HomeLayout";
import React from "react";

const TodosViewPage = () => {
  return (
    <HomeLayout>
      <TodosView />
    </HomeLayout>
  );
};

export default TodosViewPage;
