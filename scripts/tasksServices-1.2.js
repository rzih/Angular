app.factory('taskServices', function () {
    return {
        projectPriorities: function () {
            var priorities = ['Normal', 'Major', 'Critical'];
            return priorities;
        },
        projectStatuses: function () {
            var statuses = ['ToDo', 'InProgress', 'Done'];
            return statuses;
        },
        currentDate: function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            return today;
        },
        addNewTask: function (tid, newTask, selectedTaskParent, selectedPriority, selectedStatus) {
            var task = newTask;
            task.taskId = tid;
            task.indent = "";
            if (selectedTaskParent == null) {
                task.parentTaskId = tid;
                task.parentTask = task.title;
            }
            else {
                task.parentTaskId = selectedTaskParent.taskId;
                task.parentTask = selectedTaskParent.title;
                task.indent = selectedTaskParent.indent;
                task.parentTaskIndent = selectedTaskParent.indent;

                task.indent = task.indent + "\xa0\xa0";
            }
            task.title = task.indent + task.title;
            task.priority = task.indent + selectedPriority;
            task.status = task.indent + selectedStatus;
            task.dueDate = task.indent + task.dueDate;
            task.dateCreated = task.indent + this.currentDate();
            task.dateModified = task.indent + this.currentDate();

            return task;
        },
        editTask: function (updatedTask) {
            var pTaskIndent = "";

            if (updatedTask.parentTaskId != updatedTask.taskId) {
                pTaskIndent = updatedTask.parentTaskIndent + "\xa0\xa0";
            }
            var task = updatedTask;

            task.title = pTaskIndent + task.title.replace(/\s/g, '');
            task.priority = pTaskIndent + task.priority.replace(/\s/g, '');
            task.status = pTaskIndent + task.status.replace(/\s/g, '');
            task.dueDate = pTaskIndent + task.dueDate.replace(/\s/g, '');
            task.dateCreated = pTaskIndent + this.currentDate();
            task.dateModified = pTaskIndent + this.currentDate();

            return task;
        },
        deleteTask: function (currentTaskIndex, tasks) {
            if (currentTaskIndex > -1) {
                var indexC = 0;

                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i].taskId == tasks[i].parentTaskId && i > currentTaskIndex) {
                        indexC = i;
                        break;
                    }
                }

                if (currentTaskIndex == 0 && indexC == 0) {
                    indexC = tasks.length;
                }

                var delCount = (indexC - currentTaskIndex) > 0 ? (indexC - currentTaskIndex) : tasks.length - currentTaskIndex;

                if (delCount > 1 && confirm(tasks[currentTaskIndex].title + " has " + (delCount - 1).toString() + " associated sub-task(s). Deleting this task will delete all the sub-tasks."))
                    tasks.splice(currentTaskIndex, delCount);
                else if (delCount == 1 && confirm(tasks[currentTaskIndex].title + " will be deleted."))
                    tasks.splice(currentTaskIndex, delCount);
            }

            return tasks;
        }
    };
});