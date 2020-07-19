// Скрывать длинный текст
window.addEventListener('DOMContentLoaded', readMore);
window.addEventListener('resize', readMore);

const postReadMore = function(event) {
    this.firstElementChild.classList.toggle('mui-caret--up');
    this.parentElement.classList.toggle('hide-text');
}

function readMore() {

    const textBlog = document.querySelectorAll('.text-blog');

    textBlog.forEach(item => {
        if (item.offsetHeight > 60) {
            const btnMore = document.createElement('a');
            btnMore.href = '#';
            btnMore.innerHTML = 'Читать далее <span class="mui-caret"></span>';
            btnMore.addEventListener('click', postReadMore)

            item.classList.add('hide-text');
            item.appendChild(btnMore);
        }
    });

}