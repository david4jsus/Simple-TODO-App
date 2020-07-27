/*==================
  == TODO OBJECTS ==
  ==================*/

// TODO object
var TODO = function (title, description, dueDate, priority) {

   // Object properties //

   let completed = false;

   // Object methods //

   // Title getter
   const getTitle = function() {
      return title;
   }

   // Title setter
   const setTitle = function (newTitle) {
      title = newTitle;
   }

   // Description getter
   const getDescription = function() {
      return description;
   }

   // Description setter
   const setDescription = function (newDescription) {
      description = newDescription;
   }

   // Due date getter
   const getDueDate = function() {
      return dueDate;
   }

   // Due date setter
   const setDueDate = function (newDueDate) {
      dueDate = newDueDate;
   }

   // Priority getter
   const getPriority = function() {
      return priority;
   }

   // Priority setter
   const setPriority = function (newPriority) {
      priority = newPriority;
   }

   // "Done" getter
   const isCompleted = function() {
      return completed;
   }

   // Toggle whether item is done or not
   const toggleCompleted = function() {
      completed = !completed;
   }

   // Final object //
   return {getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, isCompleted, toggleCompleted};
}

// Project object
var Project = function (title, id) {

   // Object properties //

   let list = [];

   // Object methods //

   // Title getter
   const getTitle = function() {
      return title;
   }

   // Title setter
   const setTitle = function (newTitle) {
      title = newTitle;
   }

   // ID getter
   const getID = function() {
      return id;
   }

   // List item getter
   const getListItem = function (index) {
      return list[index];
   }

   // Get number of items in the list
   const getNumItems = function() {
      return list.length;
   }

   // Add an item to the list
   const addItem = function (newItem) {
      list.push (newItem);
   }

   // Remove an item from the list that matches the provided index
   const removeItem = function (index) {
      list.splice (index, 1);
   }

   // Final object //
   return {getTitle, setTitle, getID, getListItem, getNumItems, addItem, removeItem};
}

// Master object (singleton) containing all the projects
var Master = function() {

   // Object properties //

   let projectList = [];

   // Object methods //

   // Number of projects getter
   const getNumProjects = function() {
      return projectList.length;
   }

   // List project getter
   const getProject = function (index) {
      return projectList[index];
   }

   // Add a project to the list
   const addProject = function (newProjectTitle) {

      // Create new project
      let newProject = Project (newProjectTitle, Date.now());

      // Add new project to the list of projects
      projectList.push (newProject);
   }

   // Add a new TODO item to a specified project
   const addItemToProject = function (projectIndex, newItemTitle, newItemDescription, newItemDueDate, newItemPriority) {

      // Verify valid project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to create new TODO item (invalid project index)");
         return;
      }

      // Verify due date is not an empty string
      if (newItemDueDate == "") {
         let date = new Date();
         if (date.getMonth() < 10) {
            newItemDueDate = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate();
         } else {
            newItemDueDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
         }
      }

      // Create new item
      let newItem = TODO (newItemTitle, newItemDescription, newItemDueDate, newItemPriority);

      // Add item to project
      getProject (projectIndex).addItem (newItem);
   }

   // Remove a TODO item from a specified object
   const removeItemFromProject = function (itemIndex, projectIndex) {

      // Verify valid project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to delete TODO item (invalid project index)");
      }

      // Get project
      let project = getProject (projectIndex);

      // Verify valid item index
      if (itemIndex < 0 || itemIndex >= project.getNumItems) {
         console.error ("ERROR: Failed to delete TODO item (invalid item index)");
      }

      // Remove item
      project.removeItem (itemIndex);
   }

   // Remove a specified project
   const removeProject = function (projectIndex) {

      // Verify valid project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to delete project (invalid project index)");
      }

      // Remove project
      projectList.splice (projectIndex, 1);
   }

   // Get the current set of projects as JSON
   const getJSON = function() {

      // Create JSON data container
      let finalJSON = [];

      // Loop through projects and add them to the JSON container
      projectList.forEach (function (project, index) {

         // Create simplified project object
         projectObj = {};

         // Add project values
         projectObj.title = project.getTitle();
         projectObj.TODOList = [];

         // Loop through TODOs in project and add them to the list container
         for (let i = 0; i < project.getNumItems(); i++) {

            // Create instance of current TODO object
            let item = project.getListItem (i);

            // Create simplified TODO object
            TODOObj = {};

            // Add TODO values
            TODOObj.title = item.getTitle();
            TODOObj.description = item.getDescription();
            TODOObj.dueDate = item.getDueDate();
            TODOObj.priority = item.getPriority();

            // Add TODO to list container
            projectObj.TODOList[i] = TODOObj;
         }

         // Add project object to final array
         finalJSON[index] = projectObj;
      });

      // Return the finalized JSON
      return JSON.stringify (finalJSON);
   }

   // Load all app data from a JSON
   const loadFromJSON = function (loadedJSON) {

      // Create JSON object from loaded JSON
      let JSONObj = JSON.parse (loadedJSON);

      // Parse the JSON being loaded
      for (let i = 0; i < JSONObj.length; i++) {

         // Load project
         let currentProj = JSONObj[i];
         addProject (currentProj.title);

         // Load TODO items in project
         let currentTODOList = currentProj.TODOList;
         for (let j = 0; j < currentTODOList.length; j++) {

            // Load current TODO item
            let currentTODO = currentTODOList[j];
            addItemToProject (i, currentTODO.title, currentTODO.description, currentTODO.dueDate, currentTODO.priority);
         }
      }
   }

   // Final object //

   return {getNumProjects, getProject, addProject, addItemToProject, removeItemFromProject, removeProject, getJSON, loadFromJSON};
}