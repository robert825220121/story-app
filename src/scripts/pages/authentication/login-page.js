import { LoginPresenter } from "../../presenter/login-presenter";
import loginUser from "../../models/login-model";

export default class LoginPage {
  async render() {
    return `
        <section class="container login-page">
          <h1 class="login-title">Login</h1>
          <form id="login-form" class="login-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login</button>
            <div class="register-link-container">
              <p>Don't have an account? <a href="/#/register" id="register-link">Register here</a></p>
            </div>
            <div id="loading-message" class="loading-message" style="display: none;">Loading...</div>
            <div id="success-message" class="success-message" style="display: none;"></div>
            <div id="error-message" class="error-message" style="display: none;"></div>
          </form>
        </section>
      `;
  }

  async afterRender() {
    const model = new loginUser();
    const presenter = new LoginPresenter(model, this);
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      presenter.loginUser({ email, password });
    });

    const registerLink = document.getElementById("register-link");
    if (registerLink) {
      registerLink.addEventListener("click", (event) => {});
    }
  }

  showLoading() {
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.style.display = "block";
  }

  showSuccessMessage(message) {
    const successMessage = document.getElementById("success-message");
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000); 
  }

  showErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000); 
  }

  navigateToHome() {
    window.location.href = "/"; 
  }
}
