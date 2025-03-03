import HomeLayout from "@/components/layout";
import React from "react";
import TodosContainer from "@/components/todo/TodosContainer";

const TodosContainerPage = () => {
  return (
    <HomeLayout>
      <TodosContainer />
    </HomeLayout>
  );
};

export default TodosContainerPage;
