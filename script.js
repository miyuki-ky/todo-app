// ===== 1. HTMLの要素を取得 =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("todo-count");
const emptyMessage = document.getElementById("empty-message");

// localStorage に保存するときの名前（キー）
const STORAGE_KEY = "todos";

// ===== 2. タスクのデータ =====
// 1つのタスクは { id: 数字, text: "内容", completed: true/false } の形で持ちます
let todos = loadTodos();

// ===== 3. 保存と読み込み =====

// localStorage からタスクを読み込む
function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return []; // 保存データがなければ空の配列
  }
  try {
    return JSON.parse(saved); // 文字列 → 配列 に変換
  } catch (error) {
    return []; // データが壊れていた場合も空の配列
  }
}

// localStorage にタスクを保存する
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); // 配列 → 文字列 に変換
}

// ===== 4. 画面の表示 =====

// タスク一覧を画面に描き直す
function renderTodos() {
  list.innerHTML = ""; // いったん空にする

  todos.forEach(function (todo) {
    // <li> を作る
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed) {
      li.classList.add("completed");
    }

    // チェックボックス
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", function () {
      toggleTodo(todo.id);
    });

    // タスクの文字（textContent を使うと安全に文字を表示できます）
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    // 削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    // <li> の中に部品を入れて、一覧に追加
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    list.appendChild(li);
  });

  // 残りのタスク数を表示
  const remaining = todos.filter(function (todo) {
    return !todo.completed;
  }).length;
  count.textContent = todos.length > 0 ? "残り " + remaining + " 件" : "";

  // タスクが0件なら「タスクはありません」を表示
  emptyMessage.style.display = todos.length === 0 ? "block" : "none";
}

// ===== 5. タスクの操作 =====

// タスクを追加する
function addTodo(text) {
  const newTodo = {
    id: Date.now(), // 現在時刻をIDとして使う（重複しにくい）
    text: text,
    completed: false,
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

// タスクの完了 / 未完了を切り替える
function toggleTodo(id) {
  todos.forEach(function (todo) {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
  });
  saveTodos();
  renderTodos();
}

// タスクを削除する
function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id; // 指定したID以外を残す
  });
  saveTodos();
  renderTodos();
}

// ===== 6. フォームの送信（追加ボタン / Enterキー） =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // ページの再読み込みを止める

  const text = input.value.trim(); // 前後の空白を取り除く
  if (text === "") {
    return; // 空なら何もしない
  }

  addTodo(text);
  input.value = ""; // 入力欄を空にする
  input.focus();
});

// ===== 7. 最初の表示 =====
renderTodos();
