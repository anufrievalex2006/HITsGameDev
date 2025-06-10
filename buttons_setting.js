$(document).ready(function () {
    $("#mainMenu").show();

    $("#playBtn").click(function () {
        $("#mainMenu").hide();
        $("#gameScreen").show();
        startGame();
    });

    $("#editorBtn").click(function () {
        $("#mainMenu").hide();
        $("#editorScreen").show();
        initEditor();
    });

    $("#backFromGame").click(function () {
        $("#gameScreen").hide();
        $("#mainMenu").show();
        stopGame();
    });

    $("#backFromEditor").click(function () {
        $("#editorScreen").hide();
        $("#mainMenu").show();
    });

    $("#addPlatformBtn").click(startAddingPlatform);
    $("#addObstacleBtn").click(startAddingObstacle);
    $("#saveLevelBtn").click(saveLevel);
    $("#clearAllBtn").click(clearEditor);
});