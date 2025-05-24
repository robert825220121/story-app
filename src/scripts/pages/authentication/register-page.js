import RegisterModel from "../../models/register-model";
import { RegisterPresenter } from "../../presenter/register-presenter";

export default class RegisterPage {
  async render() {
    return `
        <section class="container register-page">
          <h1 class="register-title">Register</h1>
          <form id="register-form" class="register-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirm-password" required />
            </div>
            <button type="submit">Register</button>
            <div id="loading-message" class="loading-message" style="display: none;">Loading...</div>
            <div id="success-message" class="success-message" style="display: none;"></div>
            <div id="error-message" class="error-message" style="display: none;"></div>
          </form>
        </section>
      `;
  }

  async afterRender() {
    const model = new RegisterModel();
    const presenter = new RegisterPresenter(model, this);

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        this.showErrorMessage("Passwords do not match.");
        return;
      }

      presenter.registerUser({ name, email, password });
    });
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

  navigateToLogin() {
    window.location.href = "/#/login";
  }
}
