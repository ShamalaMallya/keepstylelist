var idGenerator = (function() {
    var counter = 0;
    return function() {
      return (counter += 1);
    };
  })();
  class TaskObject {
    constructor(taskName) {
      this.taskName = taskName;
      this.taskId = idGenerator();
    }
  }
  export default TaskObject;