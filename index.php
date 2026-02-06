<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>main page</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="style1.css">
    <link rel="stylesheet" href="mobile.css">
    <link rel="stylesheet" href="dark-mode.css">
    <link rel="stylesheet" href="aiplanner.css">
</head>

<body>

    <div id="navbar">
        <div id="head_container">
            <img src="studyghost logo.png" alt="logo" id="logopc">
            <button id="menu_btn"><img src="studyghost logo.png" alt="logo" id="logo"></button>
            <h1 id="heading">StudyGhost</h1>
            <button id="dark_toggle">🌙</button>
        </div>
        <div id="users">
            <p id="user_name"></p>
            <button id="logoutbtn" >logout </button>
        </div>
    </div>

    <div id="main_contain">

        <div id="card_sec">
            <!-- for planner -->
            <div id="expand">
                <!-- background expaned tasks -->

                <div id="task_list_area">
                    <ul id="task_list" class="planner-list"></ul>
                </div>


                <div class="planner-add">
                    <button id="back_btn_plan_mob">←</button>
                    <button id="back_btn_plan">← Back</button>
                    <input type="text" id="task_input" placeholder="Add a new task...">
                    <button id="add_task_mob">+</button>
                    <button id="add_task">Add</button>
                </div>
                <!-- <p class="empty-state">no containt yet</p> -->

            </div>
            <!-- for expense_tracker -->
            <div id="exp_tra">

                <div class="ad-bc">
                    <button id="back_btn_exp">← Back</button>
                    <button id="add_exp_bt">ADD NEW EXPENSE💸</button>
                    <button id="fliter"></button>
                </div>

                <div id="exp_total">
                    Total Spent: ₹ <span id="total_value">0</span>
                </div>


                <form id="expform" style="display: none;">
                    <label >Item Name</label>
                    <input type="text" name="item_name" id="item-name" placeholder="Item name" required>
                    <label >Category</label>
                    <select name="item_type" id="item-type" placeholder="Type of Item" required>
                        <option value="food">Food</option>
                        <option value="stationary">stationary</option>
                        <option value="college">college</option>
                        <option value="recharge">recharge</option>
                    </select>
                    <label >Date</label>
                    <input type="date" name="expense_date" id="date" placeholder="Date" required>
                    <label >Amount spend</label>
                    <input type="number" name="amount" id="amount" placeholder="Amount" required>
                    <div id="sum_can_btns">
                        <button type="submit" id="sumbit_btn">save</button>
                        <button type="button" id="cancel_btn">cancel</button>
                    </div>
                </form>
                <div id="explist">

                </div>
            </div>

            <!-- for Ai planner -->


            <!-- =========================
                AI PLANNER SECTION
            ========================= -->
            <div id="ai_planner">
                <div class="ai_planner_inner">

                    <!-- Top bar (same pattern as ad-bc) -->
                    <div class="ad-bc">
                        <button id="back_btn_ai">← Back</button>
                        <span><strong>AI Planner</strong></span>
                        <button id="ai_refresh_btn">⟳</button>
                    </div>

                    <!-- AI Tabs -->
                    <div id="ai_tabs">
                        <button class="ai_tab active" data-tab="ai_insights">Insights</button>
                        <button class="ai_tab" data-tab="ai_suggestions">Suggestions</button>
                        <button class="ai_tab" data-tab="ai_reflect">Reflect</button>
                    </div>

                    <!-- =========================
                        TAB CONTENTS
                ========================= -->

                    <!-- INSIGHTS -->
                    <div class="ai_content active" id="ai_insights">
                        <!-- <p class="ai_empty" id="ai_insights_empty">
                            No insights yet.<br>
                            Use the app for a day and I’ll start noticing patterns.
                        </p> -->
                        <ul>
                            <li>You complete small tasks consistently.</li>
                            <li>Study tasks drop after 9 PM.</li>
                            <li>Weekend expenses are higher than weekdays.</li>
                        </ul>

                        <button id="refresh_insights_btn">Refresh Insights</button>
                    </div>

                    <!-- SUGGESTIONS -->
                    <div class="ai_content" id="ai_suggestions">
                        <!-- <p class="ai_empty" id="ai_suggestions_empty">
                            No suggestions yet.<br>
                            Once I spot a pattern, I’ll suggest small improvements.
                        </p> -->
                        <ul>
                            <li>Try studying between 6–8 PM.</li>
                            <li>Set a daily food budget limit.</li>
                            <li>Plan tomorrow before sleeping.</li>
                        </ul>

                        <button id="try_today_btn">Try Today</button>
                    </div>

                    <!-- REFLECT -->
                    <div class="ai_content" id="ai_reflect">
                        <textarea id="ai_reflect_input" placeholder="How was today?" rows="4"></textarea>
                        <!-- <p class="ai_empty" id="ai_reflect_empty">
                            This space is for reflection.<br>
                            Write a few lines about today.
                        </p> -->

                        <button id="ask_ai_btn">Ask AI</button>

                        <div id="ai_response">
                            <!-- AI response will appear here -->
                        </div>
                    </div>
                </div>
            </div>


            <div id="feature" class="std_pla">

                <div id="planner" class="cards">
                    <h2>Day Planner</h2>
                    <p> This is a study planner. In which you can plan your studies and manage your time
                        effectively.</p>
                </div>

                <div id="expense_tracker" class="cards">
                    <h2>Expense Tracker</h2>
                    <p> This is an expense tracker. In which you can track your expenses and manage your budget
                        effectively.</p>
                </div>

                <div id="ai_notes" class="cards">
                    <h2>AI Notes</h2>
                    <p> This is an AI notes feature. In which you can take notes and manage your study materials
                        effectively.</p>
                </div>
            </div>
        </div>
    </div>


    <script src="script.js"></script>
    <script src="ai_planner.js"></script>


</body>

</html>


<!-- 31-12-25 -->
<!-- till now I have created all cards and new 
  expanded card for all things  -->

<!-- DONT FORGET YOU ARE KING OF THIS GAME -->