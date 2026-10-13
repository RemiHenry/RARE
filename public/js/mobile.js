// write a piece of code to open the mobile menu when the menu button is clicked and close it when the close button is clicked.

const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const closeButton = document.getElementById("close-menu");

menuButton.addEventListener("click", () => {
  mobileMenu.style.transform = "translateY(0)";
});

closeButton.addEventListener("click", () => {
  mobileMenu.style.transform = "translateY(-100%)";
});
