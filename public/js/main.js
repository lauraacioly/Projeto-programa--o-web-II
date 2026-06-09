document.addEventListener('DOMContentLoaded', function () {
  var toggle  = document.getElementById('sidebarToggle');
  var overlay = document.getElementById('sidebarOverlay');

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-open');
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function () {
      document.body.classList.remove('sidebar-open');
    });
  }

  // Marca link ativo na sidebar
  var path = window.location.pathname;
  document.querySelectorAll('.sidebar-link[data-path]').forEach(function (link) {
    var href = link.getAttribute('data-path');
    if (href === path || (href !== '/dashboard' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });

  // Remove classe mobile ao redimensionar para desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      document.body.classList.remove('sidebar-open');
    }
  });
});
