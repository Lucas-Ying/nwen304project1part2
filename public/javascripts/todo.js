/**
 * Created by lucas on 8/05/16.
 */

$(document).ready(function (e) {
    var ERROR_LOG = console.error.bind(console);
    var api = '/api';

    $.ajax({
        url: api + "/test_database",
        type: "GET"
    }).then(redraw, ERROR_LOG);

    $('#add-todo').button({
        icons: {primary: "ui-icon-circle-plus"}
    }).click(
        function () {
            $('#new-todo').dialog('open');
        });

    //Create a new task todo
    $('#new-todo').dialog({
        modal: true, autoOpen: false,
        open: function(){
            //Clear out any old bindings
            $('#new-todo').unbind('submit');
            $('#new-todo').submit(function(){
                //simulate click on create button
                $('#new-todo').parents('.ui-dialog').first().find('.ui-button').eq(1).click();
                return false;
            });
        },
        buttons: {
            "Add task": function () {
                var taskName = $('#task').val();
                $.ajax({
                    url: api + "/add",
                    type: "POST",
                    dataType: "json",
                    data: {sendData: taskName, listName: "todo"},
                    success: function (res) {
                        if (taskName === '') {
                            return false;
                        }
                        var taskHTML = '<li><span class="done">%</span>';
                        taskHTML += '<span class="delete">x</span>';
                        taskHTML += '<span class="task"></span></li>';
                        var $newTask = $(taskHTML);
                        $newTask.find('.task').text(taskName);
                        $newTask.hide();
                        $('#todo-list').prepend($newTask);
                        $newTask.show('clip', 250).effect('highlight', 1000);
                    },
                    error: function (res) {
                        alert("Cannot add this to the database" + res.toString());
                    }
                });
                $('#task').val('');
                $(this).dialog('close')
            },
            "Cancel": function () {
                $(this).dialog('close');
                $('#task').val('');
            }
        }
    });

    //click to move from todo to the completed list
    $('#todo-list').on('click', '.done', function () {
        var $taskItem = $(this).parent('li');
        var taskName = $taskItem.text().substring(2, $taskItem.text().length);
        $.ajax({
            url: api + "/switchToComplete",
            type: "PUT",
            data: {taskName: taskName}
        }).then(successful, ERROR_LOG);
        $taskItem.slideUp(250, function () {
            var $this = $(this);
            $this.detach();
            $('#completed-list').prepend($this);
            $this.slideDown();
        });
    });

    //click to move from completed to the todo list
    $('#completed-list').on('click', '.done', function () {
        var $taskItem = $(this).parent('li');
        var taskName = $taskItem.text().substring(2, $taskItem.text().length);
        $.ajax({
            url: api + "/switchToIncomplete",
            type: "PUT",
            data: {taskName: taskName}
        }).then(successful, ERROR_LOG);
        $taskItem.slideUp(250, function () {
            var $this = $(this);
            $this.detach();
            $('#todo-list').prepend($this);
            $this.slideDown();
        });
    });

    //when todo list receives a task
    $('#todo-list').on('sortreceive', function (e, ui) {
        var taskName = ui.item.text().substring(2, ui.item.text().length);
        $.ajax({
            url: api + "/switchToIncomplete",
            type: "PUT",
            data: {taskName: taskName}
        }).then(successful, ERROR_LOG);
    });

    //when completed list receives a task
    $('#completed-list').on('sortreceive', function (e, ui) {
        var taskName = ui.item.text().substring(2, ui.item.text().length);
        $.ajax({
            url: api + "/switchToComplete",
            type: "PUT",
            data: {taskName: taskName}
        }).then(successful, ERROR_LOG);
    });


    $('.sortlist').sortable({
        connectWith: '.sortlist',
        cursor: 'pointer',
        placeholder: 'ui-state-highlight',
        cancel: '.delete,.done'
    });


    $('.sortlist').on('click', '.delete', function () {
        $('#isDelete').dialog('open');
        $deleteThis = this;
    });


    var $deleteThis;

    // Delete an item from the list
    $('#isDelete').dialog({
        modal: true, autoOpen: false,
        buttons: {
            "Delete": function () {
                var taskName = $($deleteThis).parent('li').text();
                taskName = taskName.substring(2, taskName.length);

                $.ajax({
                    url: api + "/delete/",
                    type: "DELETE",
                    dataType: "json",
                    data: {task: taskName},
                    success: function (res) {
                        $($deleteThis).parent('li').effect('puff', function () {

                            $($deleteThis).remove();

                        });

                    },
                    error: function (res) {
                        alert("Item not deleted");
                    }

                });
                $(this).dialog('close');

            },
            "Cancel": function () {
                $(this).dialog('close');
            }
        }
    });

    //reload the data from the database into the html
    function redraw(data) {
        for (var i = 0; i < data.length; i++) {
            var taskHTML = '<li><span class="done">%</span>';
            taskHTML += '<span class="delete">x</span>';
            taskHTML += '<span class="task"></span></li>';
            var $newTask = $(taskHTML);
            $newTask.find('.task').text(data[i].item);
            $newTask.hide();
            if (data[i].completed) {
                $('#completed-list').prepend($newTask);
            } else {
                $('#todo-list').prepend($newTask);
            }
            $newTask.show('clip', 250).effect('highlight', 1000);
        }
    }

    function successful() {
        console.log("successful");
    }
}); // end ready