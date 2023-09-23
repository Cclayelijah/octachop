import Tracks from "./tracks/Tracks";
import Users from "./users/Users";

export const AdminRoute = [
  {
    name: "Tracks",
    path: "/tracks",
    component: Tracks,
    exact: true,
  },
  {
    name: "Users",
    path: "/users",
    component: Users,
    exact: true,
  },
];
