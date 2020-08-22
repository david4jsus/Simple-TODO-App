/*

   JSON app data format:
      * Array (project list)
         * Object (individual project)
            - Title: project title
            * Array (TODO list)
               * Object (individual TODO)
                  - Parent project: Integer indicating parent project index
                  - Title: TODO title
                  - Description: TODO description
                  - Due date: TODO due date
                  - Priority: TODO priority
                  - ID: TODO ID

*/

/*==================
  == TODO OBJECTS ==
  ==================*/

// TODO object
var TODO = function (parentProject, title, description, dueDate, priority, id) {

   // Object properties //

   let completed = false;
   id = ((id === undefined) ? Date.now() : id);

   // Object methods //

   // Parent project getter
   const getParentProject = function() {
      return parentProject;
   }

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

   // Get item id
   const getID = function() {
      return id;
   }

   // Final object //
   return {getParentProject, getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, isCompleted, toggleCompleted, getID};
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

   // List item getter from specified item ID
   const getItemByID = function (itemID) {

      // Return null if no item found
      let item = null;

      // Iterate through list of items
      for (let i = 0; i < getNumItems(); i++) {

         // Get current item
         let currentItem = getListItem (i);

         // Save this item if ID matches
         if (currentItem.getID() == itemID) {
            item = currentItem;
            break;
         }
      }

      // Return result
      return item;
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
   const removeItem = function (itemID) {

      // If item not found, don't remove anything
      index = -1;

      // Find item index from ID
      for (let i = 0; i < getNumItems(); i++) {
         if (getListItem (i).getID() == itemID) {
            index = i;
            break;
         }
      }

      // Remove selected item
      if (index >= 0) {
         list.splice (index, 1);
      }
   }

   // Get percentage of items completed in this project
   const getCompletionStatus = function() {

      // Let's not divide by 0
      if (getNumItems() <= 0) {
         return "Empty";
      } else {

         // The number of complete items in the project
         let completedItems = 0;

         // Iterate through items in project to see how many are completed
         for (let i = 0; i < getNumItems(); i++) {
            if (getListItem (i).isCompleted()) {
               completedItems++;
            }
         }

         // Do the math and return the result
         return ((completedItems / getNumItems() * 100).toFixed (0)) + "%";
      }
   }

   // Sort items list by a speficied criterion
   const sortItemsBy = function (criterion) {
      switch (criterion) {
         default:
         case "creationUp":
            list.sort (function (a, b) {
               return a.getID() - b.getID();
            });
            break;
         case "creationDown":
            list.sort (function (a, b) {
               return b.getID() - a.getID();
            });
            break;
         case "priorityUp":
            list.sort (function (a, b) {
               return a.getPriority() - b.getPriority();
            });
            break;
         case "priorityDown":
            list.sort (function (a, b) {
               return b.getPriority() - a.getPriority();
            });
            break;
         case "dueDateUp":
            list.sort (function (a, b) {
               let dateA = new Date (a.getDueDate());
               let dateB = new Date (b.getDueDate());
               return dateA.getTime() - dateB.getTime();
            });
            break;
         case "dueDateDown":
            list.sort (function (a, b) {
               let dateA = new Date (a.getDueDate());
               let dateB = new Date (b.getDueDate());
               return dateB.getTime() - dateA.getTime();
            });
            break;
      }
   }

   // Final object //
   return {getTitle, setTitle, getID, getListItem, getItemByID, getNumItems, addItem, removeItem, getCompletionStatus, sortItemsBy};
}

// Master object (singleton) containing all the projects
var Master = function() {

   // Object properties //

   let projectList = [];
   ghostProject = new Project ("Ghost Project", -1);

   // Object methods //

   // Number of projects getter
   const getNumProjects = function() {
      return projectList.length;
   }

   // List project getter
   const getProject = function (index) {
      if (index == -1) {
         return ghostProject;
      } else {
         return projectList[index];
      }
   }

   // Add a project to the list
   const addProject = function (newProjectTitle) {

      // Create new project
      let newProject = Project (newProjectTitle, Date.now());

      // Add new project to the list of projects
      projectList.push (newProject);
   }

   // Add a new TODO item to a specified project
   const addItemToProject = function (projectIndex, newItemTitle, newItemDescription, newItemDueDate, newItemPriority, newItemID) {

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
      let newItem = TODO (projectIndex, newItemTitle, newItemDescription, newItemDueDate, newItemPriority, newItemID);

      // Add item to project
      getProject (projectIndex).addItem (newItem);

      // Return newly created item
      return newItem;
   }

   // Remove a TODO item from a specified object
   const removeItemFromProject = function (itemID, projectIndex) {

      // Verify valid project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to delete TODO item (invalid project index)");
      } else {

         // Get project
         let project = getProject (projectIndex);

         // Remove item
         project.removeItem (itemID);
      }
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
            TODOObj.parentProject = item.getParentProject();
            TODOObj.title = item.getTitle();
            TODOObj.description = item.getDescription();
            TODOObj.dueDate = item.getDueDate();
            TODOObj.priority = item.getPriority();
            TODOObj.completed = item.isCompleted();
            TODOObj.id = item.getID();

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
            let newItem = addItemToProject (i, currentTODO.title, currentTODO.description, currentTODO.dueDate, currentTODO.priority, currentTODO.id);
            if (currentTODO.completed) {
               newItem.toggleCompleted();
            }
         }
      }
   }

   // Get the completion status of a specified item
   const getItemCompletion = function (itemID, projectIndex) {

      // Verify valid project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to fetch completion status for TODO item (invalid project index)");
      } else {

         // Get project
         let project = getProject (projectIndex);

         // Get item
         let item = project.getItemByID (itemID);

         // Get completion status of item
         return item.isCompleted();
      }
   }

   // Change the completion status of a specified item
   const toggleItemCompletion = function (itemID, projectIndex) {

      // Verify valid project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to change completion status for TODO item (invalid project index)");
      } else {

         // Get project
         let project = getProject (projectIndex);

         // Get item
         let item = project.getItemByID (itemID);

         // Get completion status of item
         item.toggleCompleted();
      }
   }

   // Sort items in projects by a specified criterion
   const sortProjectItems = function (criterion) {

      // Iterate through all projects
      for (let i = 0; i < projectList.length; i++) {

         // Sort items in current project
         getProject (i).sortItemsBy (criterion);
      }
   }

   // Get all items from all projects to view them all
   const rebuildGhostProject = function() {

      // Reset ghost project
      while (ghostProject.getNumItems() > 0) {
         let item = ghostProject.getListItem (0);
         ghostProject.removeItem (item.getID());
      }

      // Iterate through all projects
      for (let i = 0; i < projectList.length; i++) {

         // Iterate through all items
         for (let j = 0; j < projectList[i].getNumItems(); j++) {

            // Copy item
            copyItem (i, j, -1);
         }
      }

      // Return the newly build ghost project
      return ghostProject;
   }

   // Copy an item from one project to another
   const copyItem = function (firstProjectIndex, itemIndex, secondProjectIndex) {

      // Verify valid first project index
      if (firstProjectIndex < 0 || firstProjectIndex >= projectList.length) {
         console.error ("ERROR: Failed to copy item between projects (invalid first project index)");
      } else {

         // Verify valid second project index
         if (secondProjectIndex < -1 || secondProjectIndex >= projectList.length) {
            console.error ("ERROR: Failed to copy item between projects (invalid second project index)");
         } else {

            // Get projects
            let firstProject = getProject (firstProjectIndex);
            let secondProject = getProject (secondProjectIndex);

            // Verify valid item index
            if (itemIndex < 0 || itemIndex >= firstProjectIndex.getNumItems) {
               console.error ("ERROR: Failed to copy item between projects (invalid item index)");
            } else {

               // Get item
               let item = firstProject.getListItem (itemIndex);

               // Copy item
               let newItem = null;
               if (secondProjectIndex >= 0) {
                  newItem = TODO (secondProjectIndex, item.getTitle(), item.getDescription(), item.getDueDate(), item.getPriority());
               } else {
                  newItem = TODO (firstProjectIndex, item.getTitle(), item.getDescription(), item.getDueDate(), item.getPriority(), item.getID());
               }

               // Add new item
               secondProject.addItem (newItem);
            }
         }
      }
   }

   // Edit a project
   const editProject = function (projectIndex, newProjectTitle) {

      // Verify valid first project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to edit project (invalid project index)");
      } else {

         // Set new project information
         getProject (projectIndex).setTitle (newProjectTitle);
      }
   }

   // Edit a TODO item
   const editItem = function (projectIndex, itemID, newItemTitle, newItemDescription, newItemDueDate, newItemPriority) {

      // Verify valid first project index
      if (projectIndex < 0 || projectIndex >= projectList.length) {
         console.error ("ERROR: Failed to edit item (invalid project index)");
      } else {

         // Get project
         let project = getProject (projectIndex);

         // Get item
         let item = project.getItemByID (itemID);

         // Set new information
         item.setTitle (newItemTitle);
         item.setDescription (newItemDescription);
         item.setDueDate (newItemDueDate);
         item.setPriority (newItemPriority);
      }
   }

   // Final object //
   return {getNumProjects, getProject, addProject, addItemToProject, removeItemFromProject, removeProject, getJSON, loadFromJSON, getItemCompletion, toggleItemCompletion, sortProjectItems, rebuildGhostProject, editProject, editItem};
}