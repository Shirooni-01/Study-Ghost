/* =========================
   AI PLANNER SCRIPT
   (STABLE & FINAL)
========================= */

/* =========================
   GLOBAL SAFETY
========================= */
window.tasks = window.tasks || [];
window.expenses = window.expenses || [];
let AI_BUSY = false;

/* =========================
   HELPERS
========================= */

function formatAIText(text) {
    if (!text) return [];
    return text
        .replace(/\r/g, "")
        .split(/\n|•|- /)
        .map(t => t.trim())
        .filter(Boolean);
}

function renderFormattedList(listEl, lines, type = "insight") {
    listEl.innerHTML = "";

    lines.forEach(text => {
        const li = document.createElement("li");
        const lower = text.toLowerCase();

        if (type === "insight") {
            if (lower.includes("spend") || lower.includes("expense")) {
                li.textContent = "💸 Spending: " + text;
            } else if (lower.includes("task") || lower.includes("product")) {
                li.textContent = "🧠 Productivity: " + text;
            } else {
                li.textContent = "✅ Insight: " + text;
            }
        }

        if (type === "suggestion") {
            li.textContent = "👉 " + text;
        }

        listEl.appendChild(li);
    });
}

function canCallAI(key, cooldownMs = 30_000) {
    const now = Date.now();
    const last = Number(localStorage.getItem(key)) || 0;
    if (now - last < cooldownMs) return false;
    localStorage.setItem(key, now);
    return true;
}

function getDataSignature(tasks, expenses) {
    return JSON.stringify({
        tasks: tasks.map(t => ({ text: t.text, done: t.done })),
        expenses: expenses.map(e => ({
            name: e.item_name,
            amount: e.amount,
            type: e.item_type
        }))
    });
}

/* =========================
   TAB SYSTEM
========================= */

const aiTabs = document.querySelectorAll("#ai_tabs .ai_tab");
const aiContents = document.querySelectorAll(".ai_content");

function setActiveTab(tabId) {
    aiTabs.forEach(tab => tab.classList.remove("active"));
    aiContents.forEach(c => c.classList.remove("active"));
    document.querySelector(`.ai_tab[data-tab="${tabId}"]`)?.classList.add("active");
    document.getElementById(tabId)?.classList.add("active");
}

setActiveTab("ai_insights");

/* =========================
   LITE AI (FALLBACK)
========================= */

function analyzeTasksLite(tasks) {
    if (!tasks.length) return ["You haven’t added any tasks yet."];
    const done = tasks.filter(t => t.done).length;
    if (done === 0) return ["You add tasks but haven’t completed any yet."];
    if (done / tasks.length > 0.7) return ["You complete most of your tasks."];
    return ["You start tasks often but don’t always finish them."];
}

function analyzeExpensesLite(expenses) {
    if (!expenses.length) return ["No expenses recorded yet."];
    const food = expenses.filter(e => e.item_type === "food").length;
    if (food > expenses.length / 2) return ["Food is your most frequent expense category."];
    return ["Your expenses are fairly balanced."];
}

function generateSuggestionsLite(tasks, expenses) {
    const out = [];
    if (!tasks.length) out.push("Add 1 small task today to build momentum.");
    else if (!tasks.some(t => t.done)) out.push("Try completing just one task today.");
    else out.push("Keep your task list realistic and focused.");

    if (expenses.length) out.push("Review spending briefly at the end of the day.");
    return out;
}

/* =========================
   AI INSIGHTS
========================= */

const DAILY_INSIGHTS_KEY = "studyghost_daily_insights";

async function renderDailyInsights() {
    const list = document.querySelector("#ai_insights ul");
    if (!list) return;

    const today = new Date().toDateString();
    const signature = getDataSignature(tasks, expenses);
    const cached = JSON.parse(localStorage.getItem(DAILY_INSIGHTS_KEY));

    if (cached?.date === today && cached?.signature === signature) {
        renderFormattedList(list, cached.items, "insight");
        return;
    }

    if (!canCallAI("ai_insights_cooldown") || AI_BUSY) {
        const fallback = analyzeTasksLite(tasks).concat(analyzeExpensesLite(expenses));
        renderFormattedList(list, fallback, "insight");
        return;
    }

    AI_BUSY = true;

    try {
        const res = await fetch("ai.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: "insights",
                tasks,
                expenses
            })
        });

        const data = await res.json();

        if (data.reply) {
            const lines = formatAIText(data.reply);
            localStorage.setItem(
                DAILY_INSIGHTS_KEY,
                JSON.stringify({ date: today, signature, items: lines })
            );
            renderFormattedList(list, lines, "insight");
            return;
        }
    } catch (e) {
        console.warn("AI insights failed", e);
    } finally {
        AI_BUSY = false;
    }

    const fallback = analyzeTasksLite(tasks).concat(analyzeExpensesLite(expenses));
    localStorage.setItem(
        DAILY_INSIGHTS_KEY,
        JSON.stringify({ date: today, signature, items: fallback })
    );
    renderFormattedList(list, fallback, "insight");
}

/* =========================
   AI SUGGESTIONS
========================= */

const DAILY_SUGGESTION_KEY = "studyghost_daily_suggestion";

async function renderDailySuggestion() {
    const list = document.querySelector("#ai_suggestions ul");
    if (!list) return;

    const today = new Date().toDateString();
    const signature = getDataSignature(tasks, expenses);
    const cached = JSON.parse(localStorage.getItem(DAILY_SUGGESTION_KEY));

    if (cached?.date === today && cached?.signature === signature) {
        renderFormattedList(list, formatAIText(cached.text), "suggestion");
        return;
    }

    if (!canCallAI("ai_suggestion_cooldown") || AI_BUSY) {
        const fallback = generateSuggestionsLite(tasks, expenses);
        renderFormattedList(list, fallback, "suggestion");
        return;
    }

    AI_BUSY = true;

    try {
        const res = await fetch("ai.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: "suggestions",
                tasks,
                expenses
            })
        });

        const data = await res.json();

        if (data.reply) {
            localStorage.setItem(
                DAILY_SUGGESTION_KEY,
                JSON.stringify({ date: today, signature, text: data.reply })
            );
            renderFormattedList(list, formatAIText(data.reply), "suggestion");
            return;
        }
    } catch (e) {
        console.warn("AI suggestion failed", e);
    } finally {
        AI_BUSY = false;
    }

    const fallback = generateSuggestionsLite(tasks, expenses);
    localStorage.setItem(
        DAILY_SUGGESTION_KEY,
        JSON.stringify({ date: today, signature, text: fallback[0] })
    );
    renderFormattedList(list, fallback, "suggestion");
}


//================================
//AI REFLECT
//================================

function saveReflection(text, response) {
    fetch("save_reflection.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: text,
            response: response
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            console.warn("Reflection not saved", data);
        }
    })
    .catch(err => console.error("Save_reflection error", err));
}




async function fetchAIReflect() {
    const input = document.getElementById("ai_reflect_input");
    const output = document.getElementById("ai_response");
    if (!input || !output) return;

    const text = input.value.trim();
    if (!text) {
        output.textContent = "Write something first.";
        return;
    }

    output.textContent = "Thinking…";

    try {
        const res = await fetch("ai.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: "reflect",
                text: text,
                tasks: tasks,
                expenses: expenses
            })
        });

        const data = await res.json();

        if (data.reply) {
            output.textContent = data.reply;

            // optional: save reflection
            saveReflection(text, data.reply);
        } else {
            output.textContent = "AI didn’t reply.";     
        }
    } catch (err) {
         console.error(err);
        output.textContent = "AI error. Try again.";
    }
}

document.getElementById("ask_ai_btn")
  ?.addEventListener("click", fetchAIReflect);


/* =========================
   EVENTS
========================= */

aiTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const id = tab.dataset.tab;
        setActiveTab(id);
        if (id === "ai_insights") renderDailyInsights();
        if (id === "ai_suggestions") renderDailySuggestion();
    });
});

document
    .getElementById("refresh_insights_btn")
    ?.addEventListener("click", renderDailyInsights);

/* =========================
   INITIAL LOAD
========================= */
renderDailyInsights();
