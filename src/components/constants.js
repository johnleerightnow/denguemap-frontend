export const menuItems = [
  {
    label: "Home",
    key: "home",
    navigateTo: "/",
    secureLink: false,
  },
  {
    label: "Sign In",
    key: "singIn",
    navigateTo: "/signin",
    secureLink: false,
    guestOnly: true,
  },
  {
    label: "Sign Up",
    key: "singUp",
    navigateTo: "/signup",
    secureLink: false,
    guestOnly: true,
  },
  {
    label: "Profile",
    key: "profile",
    navigateTo: "/profile",
    secureLink: true,
  },
  {
    label: "About",
    key: "about",
    navigateTo: "/about",
    secureLink: false,
  },
  {
    label: "Dengue Info",
    key: "dengueInfo",
    navigateTo: "/dengueinfo",
    secureLink: false,
  },
  {
    label: "Contact",
    key: "contact",
    navigateTo: "/contactform",
    secureLink: false,
  },

  {
    label: "Log Out",
    key: "logOut",
    // Can be null, means we do not want to redirect
    navigateTo: null,
    secureLink: true,
  },
];
