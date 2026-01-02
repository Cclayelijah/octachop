import Songs from "./songs/Songs";
import Users from "./users/Users";

export const AdminRoute = [
  {
    name: "Songs",
    path: "/songs",
    component: Songs,
    exact: true,
  },
  {
    name: "Users",
    path: "/users",
    component: Users,
    exact: true,
  },
];
