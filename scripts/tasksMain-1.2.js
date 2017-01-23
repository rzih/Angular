app.controller('spacexTaskController', function ($scope, taskServices) {
    $scope.priorities = taskServices.projectPriorities();
    $scope.statuses = taskServices.projectStatuses();
    $scope.tasks = [];

    var tid = 0;
    var currentTask;
    var currentTaskIndex = -1;

    $scope.creatNewTask = function () {
        $scope.showDetail = true;
        $scope.detailModel = {};
        $scope.editing = false;
        $scope.adding = true;
    };

    $scope.selectRow = function (task, index) {
        currentTask = task;
        currentTaskIndex = index;
        $scope.detailModel = task;
        $scope.selectedPriority = $scope.priorities[$scope.priorities.indexOf(task.priority.replace(/\s/g, ''))];
        $scope.selectedStatus = $scope.statuses[$scope.statuses.indexOf(task.status.replace(/\s/g, ''))];
        $scope.selectedTaskParent = task.parentTask;
        $scope.copy = angular.copy($scope.tasks);
        $scope.showDetail = true;
        $scope.editing = true;
        $scope.adding = false;
    };

    $scope.add = function () {
        tid += 1;
        var task = taskServices.addNewTask(tid, $scope.detailModel, $scope.selectedTaskParent, $scope.selectedPriority, $scope.selectedStatus);

        $scope.tasks.push(task);
        $scope.detailModel = {};
        $scope.showDetail = false;
        $scope.selectedTaskParent = null;

        $scope.tasks.sort(function (a, b) { return a.parentTaskId - b.parentTaskId });
    };

    $scope.updateStatus = function (obj) {
        if (currentTask)
            currentTask.status = obj.selectedStatus;
    };

    $scope.updatePriority = function (obj) {
        if (currentTask)
            currentTask.priority = obj.selectedPriority;
    };

    $scope.updateTaskParent = function (obj) {
        if (currentTask) {
            currentTask.parentTaskId = obj.selectedTaskParent.taskId;
            currentTask.parentTask = obj.selectedTaskParent.title;
        }

        if ($scope.selectedTaskParent == null) {
            task.parentTaskId = 0;
            task.parentTask = 'None';
        }
        else {
            task.parentTaskId = $scope.selectedTaskParent.taskId;
            task.parentTask = $scope.selectedTaskParent.title;
        }
    };

    $scope.validateRequired = false;

    $scope.delete = function () {
        $scope.tasks = taskServices.deleteTask(currentTaskIndex, $scope.tasks);

        currentTaskIndex = -1;
        $scope.detailModel = {};
        $scope.showDetail = false;

        $scope.selectedTaskParent = null;
    };

    $scope.cancel = function () {
        if (currentTaskIndex > -1)
            $scope.tasks = $scope.copy;

        $scope.showDetail = false;

        $scope.selectedTaskParent = null;
    };

    $scope.doneEditing = function () {
        var task = taskServices.editTask($scope.detailModel);
        $scope.detailModel = {};
        $scope.showDetail = false;
        $scope.selectedTaskParent = null;
    };
});