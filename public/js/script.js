/* toggle show side tabs */
function openTab(e, tabName) {
  document.querySelectorAll('.tabcontent').forEach(tab => { 
    tab.style.display = 'none'
  })
  document.querySelectorAll('.tablinks').forEach(tablink => {
    tablink.className = tablink.className.replace('active', '')
  })
  document.getElementById(tabName).style.display = 'block'
  e.currentTarget.className += ' active'
}


function openInfoDefaultTab() {
  const infoDefaultTab = document.getElementById('active')
  infoDefaultTab.click()
}

document.addEventListener('DOMContentLoaded', openInfoDefaultTab)