let userData ={
    personalInfo:{},
    selectedTests:[]
};//переменная для хранения данных и дальнейшей деструктуризации

function showScreen(screenId){ //Эта функция нужна для переключения экранов
    const screens = document.querySelectorAll('.screen');// Сначала выполняется скрывание экранов
    screens.forEach(screen =>{
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId); //Показываем нужный экран по цели
    if (targetScreen){
        targetScreen.classList.add('active');
    };

    if(screenId === 'screen-report'){//логика для конкретных экранов
        displayReport();//Функция для заполнения данных
    };

    if(screenId === 'screen-overview'){
        const mainContent = document.querySelector('.main-content');
        if(mainContent){
            mainContent.style.display = 'none';
        }
        displayOverview();
    }else{
        const mainContent = document.querySelector('.main-content');
        if(mainContent){
            mainContent.style.display = 'flex';
        }
    }

    if (screenId === 'screen-test'){// Переход на экране тестирование
        resetTest();// Сброс
    };
};


function nextStep(currentStep){// Переход между шагами
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const circles = document.querySelectorAll('.progress-circle');

    if(currentStep === 1){// Проверка заполена ли форма, если нет отправляем заполнять
        const form = document.getElementById('infoForm');
        if(!form.checkValidity()){//встроенная в браузер функция, которая проверяет заполнены ли все поля
            alert('ERROR');
            return
        };

        const formData = new FormData(form);//Тут я сохраняю данные формы в переменную, с помощью объекта FormData(form)
        userData.personalInfo = {//Вот тут Рома, происходит сохранение данных в глобальную перменную!!!!!!!!!!!!!!!!!!!
            lastName: formData.get('lastName'),
            firstName: formData.get('firstName'),
            patronymic: formData.get('patronymic'),
            position: formData.get('position'),
            experience: formData.get('experience'),
        };

        step1.classList.remove('active');// Если пользователь заполнил форму идем дальше и обновляем прогресс
        step2.classList.add('active');
        //circles[0].classList.remove('active');
        //circles[1].classList.add('active');
    }else if(currentStep === 2){
        // В этом месте Рома, ты можешь прописывать серверную логику(сохранение или отправку на сервер)
        const checkboxes = document.querySelectorAll('input[name="testType"]:checked');
        userData.selectedTests = Array.from(checkboxes).map(cb => cb.value);
        alert('Тест завершен');
        showScreen('screen-overview');//Возрашение в меню
    };

};

function resetTest(){//Если пользователь что-то неправильно сделал, функция реализовывает сброс
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const circles = document.querySelectorAll('.progress-circle');
    const form = document.getElementById('infoForm');

    form.reset();//Сброс формы

    step1.classList.add('active');
    step2.classList.remove('active');

    /*circles[0].classList.add('active');//Сброс индикатора прогресса
    circles[1].classList.remove('active');

    for(let  i = 2;  i < circles.length; i++){// Чтобы остальные кнопки(те что зеленые оставались неактивными)
        circles[i].classList.remove('active');
    };*/

};

function displayReport(){
    const reportContainer = document.getElementById('report-content');//Тут происходиттзамена старого кода на новый html код
    if(Object.keys(userData).length === 0){//Здесь происходит интерполяция строк
        reportContainer.innerHTML = '<p>Нет данных</p>';
        return;
    };

    reportContainer.innerHTML = `
        <div>
            <h2>Общая информация</h2>
            <p><strong>ФИО:</strong> ${userData.lastName} ${userData.firstName} ${userData.patronymic}</p>
            <p><strong>Должность:</strong> ${userData.lastName} </p>
            <p><strong>Стаж:</strong> ${userData.experience} </p>
            <h2>Пройденный тест</h2>
            <p>Hard skill, Soft skill, Психометрия</p>
        </div>
    `;//Вывод данных на html страницу
};

function displayOverview(){
    const container = document.getElementById('overview-content');
    const personal = userData.personalInfo;
    const tests = userData.selectedTests;

    if(!personal || !personal.lastName){
        container.innerHTML = '<p class="no-data">Error, not found.</p>';
        return;
    };

    const testLabels = {
        'hard':'Hard skills',
        'soft':'Soft skills',
        'psycho':'Психометрия'
    };
    const selectedTestsLabels = tests.map(value => testLabels[value] || value).join(', ');

    const reportHTML = `
    <div class="overview-card">
        <h2>Персональные данные</h2>
        <p><strong>ФИО:</strong> ${userData.personalInfo.lastName} ${userData.personalInfo.firstName} ${userData.personalInfo.patronymic}</p>
        <p><strong>Должность:</strong> ${userData.personalInfo.position} </p>
        <p><strong>Стаж:</strong> ${userData.personalInfo.experience} </p>
    </div>
    <div class="overview-card">
        <h2>Пройденные тесты</h2>
        <p> ${selectedTestsLabels||'Ни один тест не выбран или непройден.'}</p>
    </div>
    <div class="overview-card">
        <h2>Статус</h2>
        <p style="color:green; font-weight:bold;">Тестирование заверщено</p>
    </div>
    `;

    container.innerHTML = reportHTML;
}

function addRepetitionValidator(inputId){
    const input = document.getElementById(inputId);
    if(!input){
        console.error(`Элемент с id="${inputId}" не найден`);
        return
    }
    input.addEventListener('input',function(){
        if(/(.)\1{3}/.test(this.value)){
            this.setCustomValidity("Нельзя вводить одиноковые символы более 3 раз подряд!");
            this.reportValidity();
        }else{
            this.setCustomValidity("");
        }
    });
}

addRepetitionValidator("lastName");
addRepetitionValidator("firstName");
addRepetitionValidator("patronymic");
