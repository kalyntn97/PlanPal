var modal = document.getElementById('profile-log-modal');

window.onclick = function(event) {
  if (event.target !== modal) {
    modal.style.display = "none"
  }
}
