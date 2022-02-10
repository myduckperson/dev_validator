// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, getIdToken, reload, getIdTokenResult, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"
import { doc, getDoc, updateDoc, getFirestore, setDoc  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxDs2c5zvgXmaao6a2JpeSKmXL4OdmIIE",
    authDomain: "dev-validator-test.firebaseapp.com",
    databaseURL: "https://dev-validator-test.firebaseio.com",
    projectId: "dev-validator-test",
    storageBucket: "dev-validator-test.appspot.com",
    messagingSenderId: "313228527018",
    appId: "1:313228527018:web:3dbaefd97fe8b0f98dd7d3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
//Підключеня бази даних Firestore
const db = getFirestore(app);

// google pop up
const provider = new GoogleAuthProvider();
// sets pop up language
auth.useDeviceLanguage();

checkUserOnLoad();

//import {checkUserOnSignIn, tasksLoad, checkUserVersion} from "./firebaseFirestore.js";


// відповідає за появу вікна для авторизації через гугл аккаунт 
async function popupGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        // // успішна авторизація
        // const user = result.user;
        // checkUserOnSignIn(user.uid)
        // .then( returnValue => {
        //     if(!returnValue){
        //         createUser(user.uid, user.displayName);
        //     }
        // });
        // localStorage.setItem("userDataPath", user.uid);
        // // із-за перезавнтаження сторінки onAuthStateChanged може спрацювати двічі
        // // що створює зайвий запит до бази даних

        // потрібність перезавантаження сторінки після входу користувача
        // під питанням, плюс ще можливі проблеми із-за асінхроності
        window.location.reload();
    }).catch((error) => {
        // помилка при авторизації
        console.log("clicked the X or this:" + error);
        const btn = document.getElementById("loginBtn");
        btn.addEventListener("click", popupGoogle, {once: true});

    });
};

// спрацьовує на завантаженні сторінки
// перевіряє чи ввійшов користувач у систему
// перевіряє версію уже ввійшовшого користувача
async function checkUserOnLoad(){
    onAuthStateChanged(auth, async function(user) {
        const btn = document.getElementById("loginBtn");

        if (user) {

            const userDocLocal = JSON.parse(localStorage.getItem("userData"));
            const uid = user.uid;

            if(!userDocLocal){
            // якщо даних в локальному сховищі неіснує при спрацьовуванні функції,
            // то користувач щойно ввійшов, бо при функція,
            // що спрацьовує при вході невстигає записати дані в локальне сховище,
            // бо onAuthStateChanged функція спрацьовує майже моментально
                const userExistOutput = await checkUserOnSignIn(uid, user.displayName)
                const userVersionOutput = await checkUserVersion(uid, userExistOutput[1]);

            // якщо локальні дані не задані (undefined), то 
            // функція викличе запит для потрібних їй даних 
            // const returnValue = await checkUserVersion(uid, userDocLocal);
                const correctVersion = userVersionOutput[0]; // boolean
            // якщо дані було не задано локально, то для того щоб далі
            // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
                const userDoc = userVersionOutput[1];
                const templateDoc = userVersionOutput[2];

                if(userExistOutput[0] && correctVersion){

                    localStorage.setItem("userData", JSON.stringify(userExistOutput[1]));
                
                }else if(userExistOutput[0]){

                    await mergeDocs(uid, userDoc, templateDoc);
                    localStorage.setItem("userData", JSON.stringify(userDoc));
                    
                }else{

                    const userDoc = await createUser(uid, user.displayName);
                    localStorage.setItem("userData", JSON.stringify(userDoc));
                    
            // зберігає посилання на інформацію користувача у локальному сховищі
            // localStorage.setItem("userDataPath", user.uid);
                };
            // зберігає посилання на інформацію користувача у локальному сховищі
                localStorage.setItem("userDataPath", uid);
                showModalResults(userDoc);
                
            }else{
            // якщо дані існують, то це означає, що AuthState змінилося із-за
            // перезавантаження сторінки
                showModalResults(userDocLocal);
                const userVersionOutput = await checkUserVersion(uid, userDocLocal);
            // якщо локальні дані не задані (undefined), то 
            // функція викличе запит для потрібних їй даних 
            // const returnValue = await checkUserVersion(uid, userDocLocal);
                const correctVersion = userVersionOutput[0]; // boolean
            // якщо дані було не задано локально, то для того щоб далі
            // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
                const userDoc = userVersionOutput[1];
                const templateDoc = userVersionOutput[2];
                if(!correctVersion){
                    await mergeDocs(uid, userDoc, templateDoc);
                    localStorage.setItem("userData", JSON.stringify(userDoc));
                }
            }

            // Руки дійшли

            // Якщо дійдуть руки, то буде перевірка версії через localStorage, а саме:
            // при вході користувача його документ зберігається локально, тоді
            // при зміні документу (наприклад при виконанні завданнь) потрібно буде
            // крім оновлення документу в базі даних, ще й оновляти локальний документ
            // ЗАВДЯКИ чому при перевірці версії запит документу користувача йде в локальне сховище,
            // що в свою чергу зменшує загальну кількість запитів на один при перевірці версії
            // АЛЕ перевірка версії відбувається досить часто (кожний раз коли спрацьовує onAuthStateChanged),
            // тому це може того вартувати
            // const userDocLocal = JSON.parse(localStorage.getItem("userData"));

            // тепер кнопка відповідає за вихід користувача
            btn.innerText = "Вийти";

            btn.addEventListener("click", signOutVar, {once: true});

            //виведення даних користувача в меню та модальне вікно
            const userName = document.getElementById("userName");
            userName.innerText = user.displayName;
            document.getElementById("userNameModal").innerText = user.displayName;
            
            
        } else {

            // Якщо користувач не війшов в аккаунт модальне вікно
            // не повинно викликатися
            // На майбутнє можливо створити анонімного користувача, але це потім
            // showModalResults("template");
            
            // тепер кнопка відповідає за вхід користувача
            btn.innerText = "Увійти";
            btn.addEventListener("click", popupGoogle, {once: true});
            console.log("user is not signed in");
        }
    });
};

// Перевіряє чи існує документ користувача в базі даних
// Повертає Promise
export async function checkUserOnSignIn(uid, userName){
    // uid - посилання на документ (userId), отримане при авторизації
    // userName - ім'я користувача, отримане при авторизації
    const theDoc = (await getDoc( doc(db, "main", uid) )).data();

    if(!theDoc){
        return [false, uid, userName];
    }else{
        return [true, theDoc];
    }
};


// Перевіряє версію документу користувача 
// додатково є можливість надати об'єкт даних користувача та об'єкт шаблону
// для того щоб за можливості не робити зайвого запиту до бази даних
async function checkUserVersion(uid, userDoc, templateDoc){
    // uid - айді користувача
    // userDoc - об'єкт даних користувача
    // templateDoc - об'єкт шаблонних даних
        if(!uid && !userDoc){
            console.error("to check version you have to provide uid or userDoc");
            return;
        }
        if(!userDoc){
            try{
                userDoc = ( await getDoc( doc(db, "main", uid) ) ).data();      
            }catch(err){
                console.error(err);
                return;
            }
        }
        if(!templateDoc){
            try{
                templateDoc = ( await getDoc( doc(db, "main", "template") ) ).data();
            }catch(err){
                console.error(err);
                return;
            }
        }
        if(templateDoc.version == userDoc.version){
            return [true, userDoc, templateDoc];
        }else{
            return [false, userDoc, templateDoc];
        }
    };


// Створення нового користувача та копіювання бази даних з шаблону template 
export async function createUser(uid, userName){
    // uid - посилання на документ (userId), отримане при авторизації
    // userName - ім'я користувача, отримане при авторизації
    const templateDocData = (await getDoc(doc(db, "main", "template"))).data();
    // зберігає інформацію користувача у локальне сховище
    // let uDoc = templateDoc.dat;

    // додає шаблону айді
    templateDocData.userName = userName;
    templateDocData.uid = uid;

    // створює інформацію користувача
    await setDoc(doc(db, "main", uid), templateDocData);
    return templateDocData;
};

// З'єднує два документи (користувача та шаблону).
// Функція потрібена для версійності.
async function mergeDocs(uid, userDoc, templateDoc){
    if(!uid && !userDoc){
        console.error("to merge template into userDoc you have to provide uid or userDoc");
        return;
    }
    if(!userDoc){
        userDoc = ( await getDoc( doc(db, "main", uid) ) ).data();
    }
    if(!templateDoc){
        templateDoc = ( await getDoc( doc(db, "main", "template") ) ).data();
        // із-за мутації шаблоного документу після з'єднання
        // змінюється і його версія на ту що була в користувача, 
        // тому її збережено в примітивну змінну
    }
    var templateVersion = templateDoc.version;
    const mergedObject = mergeObjects(templateDoc, userDoc);
    mergedObject.version = templateVersion;
    await setDoc(doc(db, "main", uid), mergedObject);
}

// нажаль ця функція зміннює вхідні об'єкти 
// (наразі проблем з цим немає, але можуть виникнути у майбутньому)
// я намагався зробити її через функційне програмування,
// але мені не вистачає часу це доробити, тому поки що залишив так
function mergeObjects(mergeFrom,mergeIn){
    // mergeFrom - шаблон з новими властивостями
    // mergeIn - об'єкт зі значеннями, які потрібно зберегти
    // проходиться по кожній властивості mergeFrom 
    // (припускається, що mergeFrom має більше властивостей, ніж mergeIn)
    // console.log(mergeFrom,mergeIn);
    Object.entries(mergeFrom).forEach(property => {
        const mergeInPropertyObj = mergeIn[property[0]];
        const mergeFromPropertyObj = property[1];
        if(
            typeof property == "object" &&
            typeof mergeFromPropertyObj == "object" &&
            !Array.isArray(mergeFromPropertyObj) &&
            property !== null &&
            mergeInPropertyObj
        ){
            // якщо властивість має непримітивне значення (об'єкт) 
            // та якщо ця властивість має теж ім'я, що й у mergeIn 
            // якщо значення другого об'єкту існує
            // поєднує вкладені об'єкти 
            mergeObjects(mergeFromPropertyObj, mergeInPropertyObj);            

        }else if(Array.isArray(mergeFromPropertyObj)){
            // якщо властивість має непримітивне значення (масив)
            // надає властивості шаблонного об'єкту масив неповторних значень
            mergeFrom[property[0]] = mergeUnique(mergeFromPropertyObj,mergeInPropertyObj);

        }else if(mergeInPropertyObj !== undefined && mergeInPropertyObj !== null){
            // якщо властивість має примітивне значення
            // якщо значення другого об'єкту існує
            // надає властивості шаблонного об'єкту значення другого об'єкту
            mergeFrom[property[0]] = mergeInPropertyObj;
        };
    });
    // повертає зміненний шаблонний об'єкт
    return mergeFrom;
};

// поєднує унікальні елементи в масиві 
// (на майбутнє, якщо прийдеться використовувати масиви)
// вкрадено з https://stackoverflow.com/a/44464083
function mergeUnique(arr1, arr2){
    return arr1.concat(arr2.filter(function (item) {
        return arr1.indexOf(item) === -1;
    }));
};



// вихід користувача
const signOutVar = async function(){
    signOut(auth).then(() => {
        localStorage.clear();
        window.location.reload();
        // showModalResults("template");
        // future popUp here
        }).catch((error) => {
        // future error popUp here
        });
};



// ------------------------------------------------------------------------------------

//Робота з базою даних

let uid = localStorage.getItem("userDataPath");

if(!uid){
    uid = "template";
};




//Get all documents in a collection
async function showModalResults(localDoc){

    //console.log("Document data:", doc.data());
    
    var tasksList = localDoc.tasks;
    Object.entries(tasksList).sort().forEach(property => {

        let lessonsList = document.getElementById('userResult');

        //https://learn.javascript.ru/modifying-document Изменение документа
        //контейнер для відображення результатів
        let divLessons = document.createElement('div');
        divLessons.className = "divLessons";
        lessonsList.insertAdjacentElement('beforeend',divLessons);

        //Відображення назви курсу 
        const lessonName = property[0];    
        let divLessonName = document.createElement('div');
        divLessonName.id = lessonName;
        divLessonName.className = "divLessonName";               
        divLessons.insertAdjacentElement('afterbegin',divLessonName);

        let h3LessonName = document.createElement('h3');
        h3LessonName.innerHTML = lessonName;
        divLessonName.insertAdjacentElement('afterbegin',h3LessonName);


        //контейнер для відображення результатів завдань
        let divTasks = document.createElement('div');
        divTasks.className = "divTasks";
        divLessons.insertAdjacentElement('beforeend',divTasks);
        
            
        Object.entries(property[1]).sort().forEach(property =>{

        //посилання на завдання

        let aTask = document.createElement('a');
        
        //умова на шлях до різних папок
        let path = window.location.href;
        let file = path.substring(path.length, path.length-8);
        
        if (file == 'task.php'){
            aTask.href = "../../tasks/" + lessonName+"_" + property[0] + "/task.php";
        } else {
            aTask.href = "tasks/" + lessonName+"_" + property[0] + "/task.php";
        }
        
        aTask.class = "a-class";
        divTasks.insertAdjacentElement('beforeend',aTask);
        let divTaskResult = document.createElement('div');
        divTaskResult.id = lessonName + "_" + property[0];
        divTaskResult.className = "divTaskResult";                
        aTask.insertAdjacentElement('beforeend',divTaskResult);
        
        //заголовок назва завдання
        let h4TaskName = document.createElement('h3');
        h4TaskName.innerHTML = property[0];
        divTaskResult.insertAdjacentElement('afterbegin',h4TaskName);

        //результат виконання завдання
        let h5TaskResult = document.createElement('h5');
        h5TaskResult.innerHTML = property[1]+"%";
        divTaskResult.insertAdjacentElement('beforeend',h5TaskResult);

        //графічне відображення прогресу https://ru.stackoverflow.com/questions/110066/%D0%9A%D0%B0%D0%BA-%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C-%D1%84%D0%BE%D0%BD-%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0-div-html-%D0%BD%D0%B5-%D0%B4%D0%BE-%D0%BA%D0%BE%D0%BD%D1%86%D0%B0
        let progress = document.createElement('progress');
        progress.min = 0;
        progress.max = 100;
        progress.value = property[1];
        divTaskResult.insertAdjacentElement('beforeend',progress);

        //console.log(property[0],":", property[1]);
        })

    });  
}
// ______________________________________________________________________________________________
// ______________________________________________________________________________________________
// ______________________________________________________________________________________________
// ______________________________________________________________________________________________
// ______________________________________________________________________________________________
// ______________________________________________________________________________________________

async function testSend(input){
    const uid = localStorage.getItem("userDataPath");
    // const userDoc = (await getDoc(doc(db,"main", uid))).data();
    console.log(input);
    await updateDoc(doc(db, "main", uid), input);
    // console.log(result);
}
async function testGet(defOutObj, taskTheme, task){
    // defOutObj - об'єкт в які владені теми завданнь
    // taskTheme - тема завдань (з номером на початку)
    // task -  номер завдання
    const uid = localStorage.getItem("userDataPath");
    const localDoc = JSON.parse(localStorage.getItem("userData"));
    console.log(defOutObj,taskTheme,task);
    if(localDoc){
        var toReturn = localDoc[defOutObj][taskTheme][task];
        console.log("not a single read request has been done");
    }else{
        var toReturn = ( await getDoc(doc(db,"main",uid))).data()[defOutObj][taskTheme][task];
    }

    return toReturn;
}

function pseudoValidation(input){
    const successBtn = document.createElement("button");
    const halfSuccessBtn = document.createElement("button");
    successBtn.innerText = "100%";
    successBtn.style.backgroundColor = "green";
    successBtn.style.position = "fixed";
    successBtn.style.left = "0px";
    successBtn.style.top = "0px";
    halfSuccessBtn.innerText = "50%";
    halfSuccessBtn.style.backgroundColor = "yellow";
    halfSuccessBtn.style.position = "fixed";
    halfSuccessBtn.style.right = "0px";
    halfSuccessBtn.style.top = "0px";

    successBtn.percent = 100;
    halfSuccessBtn.percent = 50;
    successBtn.addEventListener("click", input);
    halfSuccessBtn.addEventListener("click", input);

    document.querySelector("body").append(successBtn, halfSuccessBtn);
    return [successBtn, halfSuccessBtn];
}

// function validate(e){
//     const result = this.percent;

// }

export {testSend, testGet, pseudoValidation};