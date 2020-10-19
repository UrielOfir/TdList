//localStorage.clear();

let table = document.querySelector("tbody");
let inputItem = document.querySelector("#item");
let inputDate = document.querySelector("#date");
let itemBtn = document.querySelector("#itemBtn");

let tasks=[];

fetch('http://127.0.0.1:8081/')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        console.log(response.json());
        return;
      }

      response.text().then(function (text) {
        tasks=JSON.parse(text);
        for (i in tasks) {
          tasks[i].time = new Date(tasks[i].time);
        }
        for (let task in tasks) {
          viewTask(tasks[task]);
        }
      });
      return tasks;
     
     }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

function Task(text, time = 0, done = false) {
  this.id = 0;
  this.text = text;
  this.time = new Date(time);
  this.done = false;
}

itemBtn.onclick = function () {
  newItemText = inputItem.value;
  newItemDate = inputDate.value;
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
  console.log(tasks);
  fetch(`http://127.0.0.1:8081/`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(tasks),
})
  localStorage.setItem(`tasks`, JSON.stringify(tasks));
}
