const bars = document.getElementById("bars");
const navigation = document.getElementById("navigation");

bars.addEventListener("click", () => {
  if (navigation.className.includes("active")) {
    changeBarsIcon(true);
    navigation.classList.remove("active");
  } else {
    changeBarsIcon(false);
    navigation.classList.add("active");
  }
});

function changeBarsIcon(isNavigationActive) {
  if (isNavigationActive) {
    return (bars.className = "fa fa-bars");
  }
  return (bars.className = "fa fa-times");
}
