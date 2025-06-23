let alertDiv = document.querySelectorAll('.alert');

alertDiv.forEach(function(div) {
    div.addEventListener('click', function() {
        this.style.display = 'none';
    });
    setTimeout(function() {
        div.style.display = 'none';
    }, 3000);
});