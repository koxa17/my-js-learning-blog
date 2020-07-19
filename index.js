moment.locale('ru');

const addBlog = document.querySelector('.open-modal');
addBlog.addEventListener('click', openModal);

const displayBlog = document.querySelector('.display-blog');

function openModal(e) {
    e.preventDefault();
    const modalEl = document.createElement('div');
    modalEl.style.width = '600px';
    modalEl.style.margin = '100px auto';
    modalEl.style.padding = '20px 15px';
    modalEl.style.borderRadius = '5px';
    modalEl.style.backgroundColor = '#fff';

    modalEl.insertAdjacentHTML('afterbegin', `
        <form class="mui-form">
        <legend>После учебы</legend>

        <div class="mui-select">
            <select>
                <option value="" disabled selected>Выберите о чем будет blog...</option>
                <option value="Что выучил?">Что выучил?</option>
                <option value="Итог">Итог</option>
                </select>
            <label>Тема:</label>
        </div>

        <div class="mui-textfield">
            <textarea placeholder="Описание"></textarea>
        </div>

        <button type="submit" class="mui-btn mui-btn--raised">Добавить</button>
    </form>`);

    mui.overlay('on', modalEl);

    const form = modalEl.querySelector('form');
    form.addEventListener('submit', getValueForm);
};

function getValueForm(e) {
    e.preventDefault();
    const selected = this.querySelector('select');
    const themeBlog = this.querySelectorAll('option')[selected.selectedIndex].value;
    const textarea = this.querySelector('textarea').value;

    if (selected.selectedIndex === 0) {
        selected.style.borderColor = 'red';
        setTimeout(() => {
            selected.style.borderColor = '';
        }, 2000);
        return false
    }

    const dateNow = moment().format('L');


    const localeArray = [];
    localeArray.push({
        theme: themeBlog,
        text: textarea,
        publicDate: dateNow
    });

    setLocalStorage(localeArray);

    localeArray.forEach(render);

    mui.overlay('off');

    return localeArray;

}

function render(blog) {

    const exampleBlog = `
    <div class="mui-col-sm-10 mui-col-sm-offset-1">
        <br>
        <br>
        <div class="mui--text-black-54 mui--text-body2">День 1</div>
        <div class="mui-divider color-text">Добавленно <span id="days-ago">${genitive(dayAgo(blog.publicDate), {singular: 'день', many1: 'дня', many2: 'дней'})}</span> - <span class="italic-text">${blog.publicDate}</span></div>
        <br>
        <br>
        <div class="mui--text-headline">${blog.theme}</div>
        <div class="mui--text-black-54"></div>
        <div class="text-blog">

            <p class="text-blog__paragraph">
                ${blog.text}
            </p>

        </div>
    </div>`;

    displayBlog.insertAdjacentHTML('afterbegin', exampleBlog);

}

function setLocalStorage(blog) {
    localStorage.setItem('blog', JSON.stringify(blog));
}


function dayAgo(date) {
    const nowDate = moment(validDate(moment().format('L')));
    const publicDate = moment(validDate(date));

    const ago = nowDate.diff(publicDate, 'days');

    return nowDate.diff(publicDate, 'days');
}


function validDate(date) {
    let array = date.split('.').reverse();
    array.forEach((item, i) => {
        array[i] = parseInt(item);
    });
    return array;
}


function genitive(n, word) {
    let num = new String(n);
    num = parseInt(num[num.length - 1 || 0]);
    console.log(num);
    if (num === 0) {
        return 'Сегодня'
    } else if (num === 1) {
        return `${n} ${word.singular} назад`
    } else if (num > 1 && num < 5) {
        return `${n} ${word.many1} назад`
    } else if (num >= 5) {
        return `${n} ${word.many1} назад`
    }
}

//закончил на дате. Нужно придумать как генерировать  Добавленно столько то дней назад

function sendRequest(url, method, body = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.responseType = "json";

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }

        }

        xhr.onerror = () => {
            reject(xhr.response);
        }

        xhr.send(JSON.stringify(body));
    })
}

sendRequest('https://table-workout.firebaseio.com/.json', 'GET')
    .then(data => {
        console.log(data);
        return data
    })
    .catch(err => err)