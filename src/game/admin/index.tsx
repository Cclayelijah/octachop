import React from "react";
import { useRouter } from 'next/router';
import AdminSongs from "./songs/Songs";
import AdminUsers from "./users/Users";

type Props = {};

function Admin({}: Props) {
  const router = useRouter();
  const { query } = router;
  
  // Get the sub-route from the URL path
  const path = router.asPath;
  
  // Determine which component to render based on the path
  if (path.includes('/admin/users')) {
    return <AdminUsers />;
  } else if (path.includes('/admin/songs')) {
    return <AdminSongs />;
  } else {
    // Default to songs page
    return <AdminSongs />;
  }
}

export default Admin;
