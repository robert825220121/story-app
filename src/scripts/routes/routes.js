import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/authentication/login-page";
import RegisterPage from "../pages/authentication/register-page";
import AddStoryPage from "../pages/home/add-story-page";
import StoryDetailPage from "../pages/home/story-detail-page";
import BookmarkPage from "../pages/home/book-mark.page"; // Assuming you have a BookmarkPage class
const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add-story": new AddStoryPage(),
  "/story/:id": new StoryDetailPage(),
  "/book-mark": new BookmarkPage(), // Assuming you have a BookmarkPage class
};

export default routes;
