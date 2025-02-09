import React from "react";
import BoardsView from "@/components/board/BoardsView";
import HomeLayout from "@/components/layout/HomeLayout";

const BoardsViewPage = () => {
  return (
    <HomeLayout>
      <BoardsView />
    </HomeLayout>
  );
};

export default BoardsViewPage;
