export function createPageUrl(page) {
  switch (page) {
    case "Home":
      return "/home";
    case "Landing":
      return "/";
    case "Restaurant":
      return "/restaurant";
    case "Cart":
      return "/Cart";
    case "Orders":
      return "/Orders";
    case "Profile":
      return "/Profile";
    default:
      return "/";
  }
}
