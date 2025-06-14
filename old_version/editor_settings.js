let editorMode = null;
let tempPlatformStart = null;
let editorLevel = {
    platforms: [],
    obstacles: []
};

function initEditor() {
    const canvas = document.getElementById("editorCanvas");
    const ctx = canvas.getContext("2d");

    const savedLevel = localStorage.getItem("runnerLevel");
    if (savedLevel) {
        editorLevel = JSON.parse(savedLevel);
        updateEditorOutput("Уровень загружен из сохранения");
    } else {
        updateEditorOutput("Создайте новый уровень");
    }

    renderEditorLevel();

    canvas.addEventListener("click", handleEditorClick);
}

function handleEditorClick(event) {
    const canvas = document.getElementById("editorCanvas");
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (editorMode === "platform") {
        if (!tempPlatformStart) {
            tempPlatformStart = { x, y };
            updateEditorOutput("Укажите конец платформы");
        } else {
            editorLevel.platforms.push({
                startX: tempPlatformStart.x,
                endX: x,
                y: tempPlatformStart.y
            });
            tempPlatformStart = null;
            editorMode = null;
            updateEditorOutput("Платформа добавлена");
            renderEditorLevel();
        }
    } else if (editorMode === "obstacle") {
        editorLevel.obstacles.push({ x, y });
        updateEditorOutput("Препятствие добавлено");
        renderEditorLevel();
    }
}

function renderEditorLevel() {
    const canvas = document.getElementById("editorCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.fillStyle = "#2E8B57";
    editorLevel.platforms.forEach(platform => {
        const height = 10;
        ctx.fillRect(platform.startX, platform.y, platform.endX - platform.startX, height);

        ctx.fillStyle = "red";
        ctx.fillRect(platform.startX - 2, platform.y - 2, 4, 14);
        ctx.fillStyle = "blue";
        ctx.fillRect(platform.endX - 2, platform.y - 2, 4, 14);
        ctx.fillStyle = "#2E8B57";
    });

    ctx.fillStyle = "red";
    editorLevel.obstacles.forEach(obs => {
        const width = 20;
        const height = 50;
        ctx.fillRect(obs.x - width / 2, obs.y - height, width, height);

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "red";
    });

    if (tempPlatformStart) {
        ctx.beginPath();
        ctx.moveTo(tempPlatformStart.x, tempPlatformStart.y);
        ctx.lineTo(canvas.width, tempPlatformStart.y);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function updateEditorOutput(message) {
    $("#editorOutput").text(message);
}

function startAddingPlatform() {
    editorMode = "platform";
    tempPlatformStart = null;
    updateEditorOutput("Укажите начало платформы");
}

function startAddingObstacle() {
    editorMode = "obstacle";
    updateEditorOutput("Кликните, чтобы добавить препятствие");
}

function saveLevel() {
    localStorage.setItem("runnerLevel", JSON.stringify(editorLevel));
    updateEditorOutput("Уровень сохранён!\nТеперь можно играть");

    $("#editorOutput").html(`<pre>${JSON.stringify(editorLevel, null, 2)}</pre>`);
}

function clearEditor() {
    editorLevel = { platforms: [], obstacles: [] };
    localStorage.removeItem("runnerLevel");
    renderEditorLevel();
    updateEditorOutput("Уровень очищен");
}