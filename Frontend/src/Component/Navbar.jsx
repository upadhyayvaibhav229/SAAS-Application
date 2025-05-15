import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

const navigation = [
  { name: "Dashboard", to: "/" },
  { name: "Team", to: "/team" },
  { name: "Projects", to: "/projects" },
  { name: "Calendar", to: "/calendar" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { userData, setIsLoggedIn, setAccessToken, backendUrl, setUserData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/users/logout`);

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        setAccessToken(null); // this will also remove from localStorage
        navigate("/login");
        toast.success("Logged out successfully");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sendVerificationOTP = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/users/send-otp`,
        {
          email: userData?.email,
        }
      );

      if (data.success) {
        navigate("/verify-email");
        toast.success("Verification OTP sent successfully");

      }
    } catch (error) {
      toast.error("Failed to send verification OTP", error.message);
      console.error("Error sending verification OTP:", error);
      
    }
  }

  return (
    <Disclosure as="nav" className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
              <Bars3Icon className="block h-6 w-6 ui-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 ui-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img className="h-8 w-auto" src={assets.logo} alt="Logo" />
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {userData?.isAccountVerified ? (
                  navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))
                ) : (
                  <div className="text-red-600">Login to access dashboard</div>
                )}
              </div>
            </div>
          </div>

          {/* Profile/notification/login */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <BellIcon className="h-6 w-6" />
            </button>

            {userData ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://ui-avatars.com/api/?name=User"
                      alt="user avatar"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <NavLink
                        to="/profile"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Profile ({userData?.firstName?.[0]?.toUpperCase()})
                      </NavLink>
                    )}
                  </MenuItem>
                  {!userData?.isAccountVerified && (
                    <MenuItem>
                      <Link to="/verify-email" className="block px-4 py-2 text-sm text-red-600 cursor-pointer">
                        Verify Email
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? "bg-gray-100 cursor-pointer" : "",
                          "w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <div className="ml-3">
                <button
                  onClick={() => navigate("/login")}
                  className="rounded bg-blue-700 px-4 py-1 text-white hover:bg-blue-800"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
