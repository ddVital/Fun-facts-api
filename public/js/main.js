const bars = document.getElementById("bars");
const navigation = document.getElementById("navigation");

if (bars) {
  bars.addEventListener("click", () => {
    if (navigation.className.includes("active")) {
      changeBarsIcon(true);
      navigation.classList.remove("active");
    } else {
      changeBarsIcon(false);
      navigation.classList.add("active");
    }
  });
}

function changeBarsIcon(isNavigationActive) {
  if (isNavigationActive) {
    return (bars.className = "fa fa-bars");
  }
  return (bars.className = "fa fa-times");
}

// === login and register page === //
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

if (signInButton) {
  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  if (open === "login") container.classList.remove("right-panel-active");
  else container.classList.add("right-panel-active");
}
