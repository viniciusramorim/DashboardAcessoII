import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Eco from "./pages/dashboard/eco";
import Chucri from "./pages/dashboard/chucri";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Eco Berrini",
        path: "/eco-berrini",
        element: <Eco />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Chucri Zaidan",
        path: "/chucri-zaidan",
        element: <Chucri />,
      },
    ],
  },

];

export default routes;
