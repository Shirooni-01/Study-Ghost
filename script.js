// /*********************************
//  * GLOBAL STATE
//  *********************************/
// let expenses = [];
// let totalamt = 0;

// /*********************************
//  * CORE ELEMENTS
//  *********************************/
// const menuBtn = document.getElementById("menu_btn");
// const darkBtn = document.getElementById("dark_toggle");
// const body = document.body;

// const BackBtnPlan = document.getElementById("back_btn_plan");
// const BackBtnPlanMob = document.getElementById("back_btn_plan_mob");
// const BackBtnExp = document.getElementById("back_btn_exp");

// const card_sec = document.getElementById("card_sec");
// const cards = document.querySelectorAll(".cards");

// /*********************************
//  * DARK MODE
//  *********************************/
// darkBtn.addEventListener("click", () => {
//     body.classList.toggle("dark-mode");
// });

// /*********************************
//  * CARD OPEN / CLOSE
//  *********************************/
// cards.forEach(card => {
//     if (card.id === "planner") {
//         card.addEventListener("click", () => {
//             card_sec.classList.add("exp");
//         });
//     }

//     if (card.id === "expense_tracker") {
//         card.addEventListener("click", () => {
//             card_sec.classList.add("exptra");
//             loadExpenses();
//         });
//     }

//     if (card.id === "ai_notes") {
//         card.addEventListener("click", () => {
//             card_sec.classList.add("ai");
//         });
//     }
// });

// BackBtnPlan.addEventListener("click", () => {
//     card_sec.classList.remove("exp");
// });

// BackBtnPlanMob.addEventListener("click", () => {
//     card_sec.classList.remove("exp");
// });

// BackBtnExp.addEventListener("click", () => {
//     card_sec.classList.remove("exptra");
// });



// /*********************************
//  * PLANNER (localStorage – unchanged)
//  *********************************/
// const STORAGE_KEY = "studyghost_tasks";

// function saveTasks(tasks) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
// }

// // function loadTasks() {
// //     const data = localStorage.getItem(STORAGE_KEY);
// //     return data ? JSON.parse(data) : [];
// // }

// // let tasks = loadTasks();

// const taskInput = document.getElementById("task_input");
// const addTaskBtn = document.getElementById("add_task");
// const addTaskBtnMob = document.getElementById("add_task_mob");
// const taskList = document.getElementById("task_list");

// function renderTasks() {
//     taskList.innerHTML = "";

//     tasks.forEach((task, index) => {
//         const li = document.createElement("li");
//         li.className = "planner-item";
//         if (task.done) li.classList.add("done");

//         li.innerHTML = `
//     <span class="task_text ${task.done ? "done" : ""}">
//         ${task.text}
//     </span>
//     <div class="btn_group_plan">
//         <button class="done_btn" data-id="${task.id}">
//             ${window.innerWidth > 480 ? "Completed" : "O"}
//         </button>
//         <button class="del_btn" data-id="${task.id}">
//             ${window.innerWidth > 480 ? "Delete" : "X"}
//         </button>
//     </div>
// `;


//         taskList.appendChild(li);
//     });
// }

// // function addTask() {
// //     const text = taskInput.value.trim();
// //     if (!text) return;

// //     // tasks.push({ text, done: false });
// //     // saveTasks(tasks);
// //     // renderTasks();
// //     taskInput.value = "";

// //     // fetch("add_task.php", {
// //     //     method: "POST",
// //     //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
// //     //     body: "task=" + encodeURIComponent(text)
// //     // });

// //     fetch("add_task.php", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
// //         body: new URLSearchParams({
// //             action: "add",
// //             task: text
// //         })
// //     }).then(() => {
// //         loadTasksFromDB(); // 🔥 reload user tasks
// //     });

// // }


// function addTask() {
//     const text = taskInput.value.trim();
//     if (!text) return;

//     fetch("add_task.php", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//             action: "add",
//             task: text
//         })
//     }).then(() => {
//         taskInput.value = "";
//         loadTasksFromDB();
//     });
// }





// addTaskBtn.addEventListener("click", addTask);
// addTaskBtnMob.addEventListener("click", addTask);

// // taskList.addEventListener("click", e => {
// //     const index = e.target.dataset.index;
// //     if (index === undefined) return;

// //     if (e.target.classList.contains("done_btn")) {
// //         tasks[index].done = !tasks[index].done;
// //     }

// //     if (e.target.classList.contains("del_btn")) {
// //         tasks.splice(index, 1);
// //     }

// //     saveTasks(tasks);
// //     // renderTasks();
// // });

// taskList.addEventListener("click", (e) => {
//     const id = e.target.dataset.id;
//     if (!id) return;

//     // ✅ TOGGLE COMPLETE
//     if (e.target.classList.contains("done_btn")) {
//         fetch("add_task.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//                 action: "toggle",
//                 id: id
//             })
//         }).then(() => loadTasksFromDB());
//     }

//     // 🗑️ DELETE TASK
//     if (e.target.classList.contains("del_btn")) {
//         fetch("add_task.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//                 action: "delete",
//                 id: id
//             })
//         }).then(() => loadTasksFromDB());
//     }
// });


// function loadTasksFromDB() {
//     fetch("add_task.php?action=fetch")
//         .then(res => res.json())
//         .then(data => {
//             if (data.error) {
//                 console.error(data.error);
//                 return;
//             }

//             tasks = data.map(t => ({
//                 id: t.id,
//                 text: t.text,
//                 done: t.done   // ✅ respect DB state
//             }));


//             renderTasks();
//         })
//         .catch(err => console.error("Task fetch error:", err));
// }





// /*********************************
//  * EXPENSE TRACKER (ONE PHP FILE)
//  *********************************/
// const addexp = document.getElementById("add_exp_bt");
// const form = document.getElementById("expform");
// const explist = document.getElementById("explist");
// const totalValueEl = document.getElementById("total_value");
// const cancelBtn = document.getElementById("cancel_btn");
// const divbtns = document.getElementById("sum_can_btns");




// addexp.addEventListener("click", () => {
//     form.style.display = "flex";
//     divbtns.style.display = "flex";
// });

// cancelBtn.addEventListener("click", () => {
//     form.style.display = "none";
//     divbtns.style.display = "none";
// });


// /*********************************
//  * LOAD EXPENSES
//  *********************************/
// function loadExpenses() {
//     fetch("expense.php?action=fetch")
//         .then(res => res.json())
//         .then(data => {
//             expenses = data;   // 🔥 DB is source of truth
//             renderExpenses();
//         })
//         .catch(err => console.error("Expense fetch error:", err));
// }




// /*********************************
//  * RENDER EXPENSES
//  *********************************/
// function renderExpenses() {
//     explist.innerHTML = "";
//     totalamt = 0;

//     expenses.forEach(exp => {
//         totalamt += Number(exp.amount);

//         const card = document.createElement("div");
//         card.classList.add("expcard", "listofexp");

//         card.innerHTML = `
//             <div class="exp-row">
//                 <p class="exp">${exp.item_name}</p>
//                 <p class="exp">₹${exp.amount}</p>
//             </div>

//             <div class="exp-details">
//                 <p class="exp">Type: ${exp.item_type}</p>
//                 <p class="exp">Date: ${exp.expense_date}</p>
//                 <button class="del-exp-btn" data-id="${exp.id}">

//                     delete
//                 </button>
//             </div>
//         `;

//         card.addEventListener("click", e => {
//             if (e.target.classList.contains("del-exp-btn")) return;
//             if (window.innerWidth < 480) {
//                 card.classList.toggle("mob_exp_expand");
//             }
//         });

//         explist.appendChild(card);
//     });

//     totalValueEl.innerText = totalamt;
// }

// /*********************************
//  * ADD EXPENSE
//  *********************************/
// form.addEventListener("submit", e => {
//     e.preventDefault();

//     const data = new URLSearchParams({
//         action: "add",
//         name: document.getElementById("item-name").value,
//         type: document.getElementById("item-type").value,
//         amount: document.getElementById("amount").value,
//         date: document.getElementById("date").value
//     });

//     fetch("expense.php", {
//         method: "POST",
//         body: data
//     }).then(() => {
//         form.reset();
//         form.style.display = "none";
//         loadExpenses();
//     });
// });

// /*********************************
//  * DELETE EXPENSE
//  *********************************/
// explist.addEventListener("click", (e) => {
//     if (!e.target.classList.contains("del-exp-btn")) return;

//     e.stopPropagation(); // important

//     const id = e.target.dataset.id;

//     // fetch("expense.php", {
//     //     method: "POST",
//     //     body: new URLSearchParams({
//     //         action: "delete",
//     //         id: id
//     //     })
//     // })
//     //     .then(res => res.text())
//     //     .then(() => {
//     //         loadExpenses(); // 🔥 reload from DB
//     //     });


//     fetch("expense.php", {
//         method: "POST",
//         body: new URLSearchParams({
//             action: "delete",
//             id: id
//         })
//     }).then(() => loadExpenses());

//         // .then(res => res.json())
//         // .then(res => {
//         //     console.log("ADD RESPONSE:", res);
//         //     if (res.status === "added") {
//         //         form.reset();
//         //         form.style.display = "none";
//         //         loadExpenses();
//         //     } else {
//         //         console.error(res);
//         //     }
//         // });

// });





// /*********************************
//  * INITIAL LOAD
//  *********************************/
// // renderTasks();
// loadTasksFromDB();










/*********************************
 * GLOBAL STATE
 *********************************/
let expenses = [];
let totalamt = 0;
let tasks = [];




const HIDDEN_TASKS_KEY = "studyghost_hidden_tasks";

function getHiddenTasks() {
    return JSON.parse(localStorage.getItem(HIDDEN_TASKS_KEY)) || [];
}

function hideTask(id) {
    const hidden = getHiddenTasks();
    if (!hidden.includes(id)) {
        hidden.push(id);
        localStorage.setItem(HIDDEN_TASKS_KEY, JSON.stringify(hidden));
    }
}





const HIDDEN_EXPENSES_KEY = "studyghost_hidden_expenses";

function getHiddenExpenses() {
    return JSON.parse(localStorage.getItem(HIDDEN_EXPENSES_KEY)) || [];
}

function hideExpense(id) {
    const hidden = getHiddenExpenses();
    if (!hidden.includes(id)) {
        hidden.push(id);
        localStorage.setItem(HIDDEN_EXPENSES_KEY, JSON.stringify(hidden));
    }
}


/*********************************
 * CORE ELEMENTS
 *********************************/
const darkBtn = document.getElementById("dark_toggle");
const body = document.body;

const BackBtnPlan = document.getElementById("back_btn_plan");
const BackBtnPlanMob = document.getElementById("back_btn_plan_mob");
const BackBtnExp = document.getElementById("back_btn_exp");

const card_sec = document.getElementById("card_sec");
const cards = document.querySelectorAll(".cards");

/*********************************
 * DARK MODE
 *********************************/
darkBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
});

/*=======================================
USER-NAME DISPLAY
==========================================*/
const usernameEl = document.getElementById("user_name");

if (usernameEl) {
    fetch("/SGP/auth/me.php", { credentials: "same-origin" })
        .then(res => res.json())
        .then(user => {
            usernameEl.textContent = user.name;
        })
        .catch(() => {
            usernameEl.textContent = "Guest";
        });
}


/*********************************
 * CARD OPEN / CLOSE
 *********************************/
cards.forEach(card => {
    if (card.id === "planner") {
        card.addEventListener("click", () => {
            card_sec.classList.add("exp");
        });
    }

    if (card.id === "expense_tracker") {
        card.addEventListener("click", () => {
            card_sec.classList.add("exptra");
            loadExpenses();
        });
    }

    if (card.id === "ai_notes") {
        card.addEventListener("click", () => {
            card_sec.classList.add("ai");
        });
    }
});

BackBtnPlan.addEventListener("click", () => card_sec.classList.remove("exp"));
BackBtnPlanMob.addEventListener("click", () => card_sec.classList.remove("exp"));
BackBtnExp.addEventListener("click", () => card_sec.classList.remove("exptra"));

/*********************************
 * TASK PLANNER (DB BASED)
 *********************************/
const taskInput = document.getElementById("task_input");
const addTaskBtn = document.getElementById("add_task");
const addTaskBtnMob = document.getElementById("add_task_mob");
const taskList = document.getElementById("task_list");

/* Render Tasks */
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "planner-item";
        if (task.done) li.classList.add("done");

        li.innerHTML = `
            <span class="task_text ${task.done ? "done" : ""}">
                ${task.text}
            </span>
            <div class="btn_group_plan">
                <button class="done_btn" data-id="${task.id}">
                    ${window.innerWidth > 480 ? "Completed" : "O"}
                </button>
                <button class="del_btn" data-id="${task.id}">
                    ${window.innerWidth > 480 ? "Delete" : "X"}
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

/* Add Task */
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    fetch("add_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            action: "add",
            task: text
        })
    }).then(() => {
        taskInput.value = "";
        loadTasksFromDB();
    });
}

addTaskBtn.addEventListener("click", addTask);
addTaskBtnMob.addEventListener("click", addTask);

/* Toggle / Delete Task */
// taskList.addEventListener("click", (e) => {
//     const id = e.target.dataset.id;
//     if (!id) return;

//     if (e.target.classList.contains("done_btn")) {
//         fetch("add_task.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//                 action: "toggle",
//                 id: id
//             })
//         }).then(() => loadTasksFromDB());
//     }

//     if (e.target.classList.contains("del_btn")) {
//         fetch("add_task.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//                 action: "delete",
//                 id: id
//             })
//         }).then(() => loadTasksFromDB());
//     }
// });


taskList.addEventListener("click", (e) => {

    const doneBtn = e.target.closest(".done_btn");
    const delBtn = e.target.closest(".del_btn");

    // ✅ COMPLETE / TOGGLE
    if (doneBtn) {
        console.log("DONE BUTTON CLICKED", doneBtn.dataset.id);
        const id = doneBtn.dataset.id;

        fetch("add_task.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: "toggle",
                id: id
            })
        }).then(() => loadTasksFromDB());

        return;
    }

    // 🗑️ DELETE
    if (delBtn) {
        console.log("DELETE BUTTON CLICKED", delBtn.dataset.id);
        const id = delBtn.dataset.id;

        if (delBtn) {
            console.log("DELETE (UI ONLY)", delBtn.dataset.id);
            const id = parseInt(delBtn.dataset.id, 10);

            hideTask(id);      // ✅ hide locally
            loadTasksFromDB(); // ✅ update UI

            return;
        }


        return;
    }


});






/* Fetch Tasks */
function loadTasksFromDB() {
    fetch("add_task.php?action=fetch")
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const hidden = getHiddenTasks();

            tasks = data
                .filter(t => !hidden.includes(t.id)) // 🔥 hide locally deleted tasks
                .map(t => ({
                    id: t.id,
                    text: t.text,
                    done: t.done
                }));


            renderTasks();
        })
        .catch(err => console.error("Task fetch error:", err));
}

/*********************************
 * EXPENSE TRACKER
 *********************************/
const addexp = document.getElementById("add_exp_bt");
const form = document.getElementById("expform");
const explist = document.getElementById("explist");
const totalValueEl = document.getElementById("total_value");
const cancelBtn = document.getElementById("cancel_btn");
const divbtns = document.getElementById("sum_can_btns");

addexp.addEventListener("click", () => {
    form.style.display = "flex";
    divbtns.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
    form.style.display = "none";
    divbtns.style.display = "none";
});

/* Load Expenses */
function loadExpenses() {
    fetch("expense.php?action=fetch")
        .then(res => res.json())
        .then(data => {
            const hidden = getHiddenExpenses();

            expenses = data.filter(exp => !hidden.includes(exp.id));
            renderExpenses();

        })
        .catch(err => console.error("Expense fetch error:", err));
}

/* Render Expenses */
function renderExpenses() {
    explist.innerHTML = "";
    totalamt = 0;

    expenses.forEach(exp => {
        totalamt += Number(exp.amount);

        const card = document.createElement("div");
        card.classList.add("expcard", "listofexp");

        card.innerHTML = `
            <div class="exp-row">
                <p class="exp">${exp.item_name}</p>
                <p class="exp">₹${exp.amount}</p>
            </div>
            <div class="exp-details">
                <p class="exp">Type: ${exp.item_type}</p>
                <p class="exp">Date: ${exp.expense_date}</p>
                <button class="del-exp-btn" data-id="${exp.id}">delete</button>
            </div>
        `;

        explist.appendChild(card);
    });

    totalValueEl.innerText = totalamt;
}

/* Add Expense */
form.addEventListener("submit", e => {
    e.preventDefault();

    fetch("expense.php", {
        method: "POST",
        body: new URLSearchParams({
            action: "add",
            name: document.getElementById("item-name").value,
            type: document.getElementById("item-type").value,
            amount: document.getElementById("amount").value,
            date: document.getElementById("date").value
        })
    }).then(() => {
        form.reset();
        form.style.display = "none";
        loadExpenses();
    });
});

/* Delete Expense */
explist.addEventListener("click", e => {
    if (!e.target.classList.contains("del-exp-btn")) return;

    const id = e.target.dataset.id;

    explist.addEventListener("click", e => {
        if (!e.target.classList.contains("del-exp-btn")) return;

        const id = parseInt(e.target.dataset.id, 10);

        hideExpense(id);   // ✅ hide locally
        loadExpenses();    // ✅ re-render UI
    });

});


/*********************************
 * BACK BTN AND FILTER INNERHTML
 * *******************************/


const filter = document.getElementById("fliter");

if (window.innerWidth < 480) {
    BackBtnExp.innerText = "←";
    filter.innerText = "ᯤ";
    addexp.innerText = "ADD EXPENSE💸";
}
else {
    BackBtnExp.innerText = "← Back";
    filter.innerText = "filter";
    addexp.innerText = "ADD NEW EXPENSE💸";
}

// BackBtnExp.addEventListener("click", () => {
//     form.style.display = "none";
// });

/*************************************
==============AI SCRIPT==============
 *************************************/
const backBtnAI = document.getElementById("back_btn_ai");

if (backBtnAI) {
    backBtnAI.addEventListener("click", () => {
        card_sec.classList.remove("ai");
    });
}


/*===================================
    logout btn 
==================================*/
const logoutBtn = document.getElementById("logoutbtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        fetch("/SGP/auth/logout.php", {
            method: "POST",
            credentials: "same-origin"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Optional: clear frontend state
                window.tasks = [];
                window.expenses = [];

                // Reload app → guest login will auto-trigger
                // location.reload();
                window.location.href = "/SGP/auth/login.php";

            }
        })
        .catch(err => console.error("Logout failed", err));
    });
}



fetch("/SGP/auth/guest_login.php", {
    credentials: "same-origin"
})
.then(res => res.json())
.then(data => {
    if (data.success && data.guest) {
        console.log("Guest session started");
    }
});



/*********************************
 * INITIAL LOAD
 *********************************/
loadTasksFromDB();


