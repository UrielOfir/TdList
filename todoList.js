//localStorage.clear();

let table = document.querySelector("tbody");
let inputItem = document.querySelector("#item");
let inputDate = document.querySelector("#date");
let itemBtn = document.querySelector("#itemBtn");

function Task(text, time = 0, done = false) {
  this.id = IDcounter;
  IDcounter++;
  localStorage.setItem(`IDcounter`, IDcounter);
  this.text = text;
  this.time = new Date(time);
  this.done = false;
}

let tasks = [];
if (localStorage.getItem(`tasks`) === null)
  localStorage.setItem(`tasks`, JSON.stringify(tasks));
tasks = JSON.parse(localStorage.getItem(`tasks`));
for (i in tasks) {
  tasks[i].time = new Date(tasks[i].time);
}
console.log(tasks);

if (localStorage.getItem(`IDcounter`) === null)
  localStorage.setItem(`IDcounter`, 0);
let IDcounter = localStorage.getItem(`IDcounter`);

for (let task in tasks) {
  viewTask(tasks[task]);
}

itemBtn.onclick = function () {
  newItemText = inputItem.value;
  newItemDate = inputDate.value;
  console.log(inputDate.value);
  if (addTask(newItemText, newItemDate)) {
    viewTask(tasks[tasks.length - 1]);
  }
  inputItem.value = ``;
};

function addTask(newItemText, newItemDate) {
  if (newItemDate === ``) {
    alert("Please choose a date");
    return false;
  } else {
    task = new Task(this.newItemText, this.newItemDate);
    tasks.push(task);
    updateServer();
    console.log(tasks);
    return true;
  }
}

function viewTask(task) {
  // Getting HTML elements
  let item = document.createElement(`tr`);
  let thTask = document.createElement(`th`);
  let thDate = document.createElement(`th`);
  let thDone = document.createElement(`th`);
  let delet = document.createElement(`button`);
  let edit = document.createElement(`button`);
  let done = document.createElement(`button`);

  item.appendChild(thTask);
  item.appendChild(thDate);
  item.appendChild(thDone);
  item.appendChild(edit);
  item.appendChild(delet);
  item.appendChild(done);
  doneHandler();
  delet.innerHTML = "Delete";
  edit.innerHTML = "Edit";

  thTask.innerHTML = task.text;
  thDate.innerHTML = task.time.toDateString();
  table.appendChild(item);

  edit.onclick = () => editTask();
  delet.onclick = () => deleteTask();
  done.onclick = () => {
    task.done = task.done ? false : true;
    updateServer();
    doneHandler();
  };
  inputItem.focus();

  function doneHandler() {
    if (task.done === false) {
      done.innerHTML = "Done";
      thDone.innerHTML = "No";
    } else {
      done.innerHTML = "Undone";
      thDone.innerHTML = "Yes";
    }
  }

  function editTask() {
    thTask.setAttribute(`contenteditable`, true);
    thTask.focus();
    thDate.innerHTML = ``;
    editDate = thDate.appendChild(inputDate.cloneNode(true));
    editDate.value = formatDate(task.time);
    thTask.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        finishEditing();
      }
    });
    thDate.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        finishEditing();
      }
    });

    function finishEditing() {
      let dateFormat = /^(\d{4})[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/;
      if (editDate.value.match(dateFormat)) {
        task.text = thTask.innerHTML;
        thTask.setAttribute(`contenteditable`, false);
        task.date = Date(thDate.innerHTML);
        thDate.innerHTML = task.time.toDateString();
        updateServer();
      }
    }

    function formatDate() {
      var d = new Date(task.time),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }
  }

  function deleteTask() {
    item.style.display = `none`;

    const index = tasks.indexOf(task);
    if (index > -1) {
      tasks.splice(index, 1);
      updateServer();
    }
  }
}

function updateServer() {
  localStorage.setItem(`tasks`, JSON.stringify(tasks));
}
