/*======================
  == DOM MANIPULATION ==
  ======================*/

//import {TODO, Project, Master} from "./todo"

var TODOController = function() {

   // == OBJECT PROPERTIES ==

   let master = Master();
   let currentProjectIndex = -1;
   let currentTheme = 0;
   let showCompletionSetting = false;
   let sortCriterion = "creationUp";

   // Main container
   let mainContainer = document.getElementById ("body");

   // == OBJECT METHODS ==

   // Unload any DOM attached to the main container
   function UnloadViews() {

      // Get container
      let container = document.getElementById ("body");

      // Erase everything
      container.textContent = "";

      // Remove dimmer
      removeDimmer();
   }

   // Load main page (show list of projects)
   function LoadMainView() {

      // Update internal variable
      currentProjectIndex = -1;

      // Erase DOM from main conatiner
      UnloadViews();

      // Create view title
      let title = document.createElement ("h2");
      let titleText = document.createTextNode ("Projects | ");
      let titleAddButton = document.createElement ("button");
      titleAddButton.textContent = "\uFF0B";
      titleAddButton.onclick = LoadNewProjectView;
      let titleDivider = document.createTextNode (" | ");
      let titleShowAllItemsButton = document.createElement ("button");
      titleShowAllItemsButton.textContent = "Show all TODO items";
      titleShowAllItemsButton.onclick = loadAllItemsView;
      title.appendChild (titleText);
      title.appendChild (titleAddButton);
      title.appendChild (titleDivider);
      title.appendChild (titleShowAllItemsButton);
      mainContainer.appendChild (title);

      // Create container for list of projects
      let listContainer = document.createElement ("ul");

      // Create and append each project from the list
      for (let i = 0; i < master.getNumProjects(); i++) {

         // Create list item with project title
         let projectListing = document.createElement ("li");
         projectListing.className = "projectListing";
         projectListing.onclick = function() {LoadProjectView (i)};
         let projectTitle = document.createElement ("span");
         projectTitle.textContent = master.getProject (i).getTitle();
         projectListing.appendChild (projectTitle);
         let projectDeleteButton = document.createElement ("span");
         projectDeleteButton.className = "projectListingFloating";
         projectDeleteButton.textContent = " | Delete";
         projectDeleteButton.onclick = function (evt) {
            evt.stopPropagation();
            RemoveProject (i);
         };
         projectListing.appendChild (projectDeleteButton);
         listContainer.appendChild (projectListing);
      }

      // Append list to container
      mainContainer.appendChild (listContainer);
   }

   // Load menu to add a project
   function LoadNewProjectView() {

      // Add dimmer
      addDimmer();

      // Create view container
      let menuContainer = document.createElement ("div");
      menuContainer.id = "newProjectMenu";
      menuContainer.className = "floatingMenu";

      // Create menu title
      let menuTitle = document.createElement ("h3");
      menuTitle.textContent = "New Project";
      menuContainer.appendChild (menuTitle);

      // Create new project title container
      let newProjectTitleContainer = document.createElement ("p");

      // Create new project title label
      let newProjectTitleLabel = document.createElement ("label");
      newProjectTitleLabel.textContent = "Title:";
      newProjectTitleLabel.for = "newProjectTitle";
      newProjectTitleContainer.appendChild (newProjectTitleLabel);

      // Create new project title textbox
      let newProjectTitleTextbox = document.createElement ("input");
      newProjectTitleTextbox.type = "text";
      newProjectTitleTextbox.id = "newProjectTitle";
      newProjectTitleTextbox.placeholder = "New Project";
      newProjectTitleContainer.appendChild (newProjectTitleTextbox);

      // Append new project title conatiner to menu container
      menuContainer.appendChild (newProjectTitleContainer);

      // Create button to create the new project
      let newProjectCreate = document.createElement ("button");
      newProjectCreate.textContent = "Create";
      newProjectCreate.onclick = CreateNewProject;
      menuContainer.appendChild (newProjectCreate);

      // Create some spacing between the two buttons
      let spacing = document.createElement ("span");
      spacing.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
      menuContainer.appendChild (spacing);

      // Create button to cancel new project
      let newProjectCancel = document.createElement ("button");
      newProjectCancel.textContent = "Cancel";
      newProjectCancel.onclick = UnloadNewProjectView;
      menuContainer.appendChild (newProjectCancel);

      // Append view container to main container
      mainContainer.appendChild (menuContainer);
   }

   // Create a new project from the new project menu
   function CreateNewProject() {

      // Get information for new project
      let newProjectTitle = document.getElementById ("newProjectTitle").value;

      // Create new project
      master.addProject (newProjectTitle);

      // Unload new project menu and refresh main view
      LoadMainView();

      // Save current app information
      saveAppData();
   }

   // Cancel and get rid of menu to add a new project
   function UnloadNewProjectView() {

      // Get new project menu
      let newProjectMenu = document.getElementById ("newProjectMenu");

      // Continue if the menu exists
      if (newProjectMenu !== null) {
         mainContainer.removeChild (newProjectMenu);
      }

      // Remove dimmer
      removeDimmer();
   }

   // Load specific project view (to see details about a specific project)
   function LoadProjectView (projectIndex) {

      // Update internal variable
      currentProjectIndex = projectIndex;

      // Erase DOM from main container
      UnloadViews();

      // Get project to show
      let project = master.getProject (projectIndex);

      // Create link back to project list
      let linkBack = document.createElement ("h4");
      linkBack.className = "projectLinkBack";
      linkBack.textContent = "< Projects";
      linkBack.onclick = LoadMainView;
      mainContainer.appendChild (linkBack);

      // Create view title
      let title = document.createElement ("h2");
      let titleTitle = document.createElement ("span");
      titleTitle.textContent = project.getTitle();
      let titleCompletion = document.createElement ("span");
      titleCompletion.id = "projectCompletionSpan";
      titleCompletion.textContent = " (" + project.getCompletionStatus() + ")";
      if (showCompletionSetting) {
         titleCompletion.className = "not-hidden";
      } else {
         titleCompletion.className = "hidden";
      }
      let titleDivider = document.createTextNode (" | ");
      let sortText = document.createTextNode ("Sort by ");
      let sortOption = document.createElement ("select");
      sortOption.id = "itemSortOption";
      let sortCreationUp = document.createElement ("option");
      sortCreationUp.value = "creationUp";
      sortCreationUp.textContent = "order of creation ↑";
      sortOption.appendChild (sortCreationUp);
      let sortCreationDown = document.createElement ("option");
      sortCreationDown.value = "creationDown";
      sortCreationDown.textContent = "order of creation ↓";
      sortOption.appendChild (sortCreationDown);
      let sortPriorityUp = document.createElement ("option");
      sortPriorityUp.value = "priorityUp";
      sortPriorityUp.textContent = "item priority ↑";
      sortOption.appendChild (sortPriorityUp);
      let sortPriorityDown = document.createElement ("option");
      sortPriorityDown.value = "priorityDown";
      sortPriorityDown.textContent = "item priority ↓";
      sortOption.appendChild (sortPriorityDown);
      let sortDueDateUp = document.createElement ("option");
      sortDueDateUp.value = "dueDateUp";
      sortDueDateUp.textContent = "due date ↑";
      sortOption.appendChild (sortDueDateUp);
      let sortDueDateDown = document.createElement ("option");
      sortDueDateDown.value = "dueDateDown";
      sortDueDateDown.textContent = "due date ↓";
      sortOption.appendChild (sortDueDateDown);
      sortOption.onchange = function() {
         sortCriterion = sortOption.value;
         master.sortProjectItems (sortCriterion);
         LoadProjectView (currentProjectIndex);
         saveAppData();
         saveExtraAppData();
      };
      sortOption.value = sortCriterion;
      let titleDivider2 = document.createTextNode (" | ");
      let titleDropDownBtn = document.createElement ("button");
      titleDropDownBtn.innerHTML = "\u22EE";
      titleDropDownBtn.onclick = toggleProjectDropDown;
      let titleDropDownMenu = document.createElement ("ul");
      titleDropDownMenu.id = "projectDropDown";
      titleDropDownMenu.style.display = "none";
      let titleDeleteItem = document.createElement ("li");
      let itemDeleteButton = document.createElement ("div");
      itemDeleteButton.textContent = "Delete project";
      itemDeleteButton.onclick = function() {RemoveProject (currentProjectIndex)};
      titleDeleteItem.appendChild (itemDeleteButton);
      let titleEditItem = document.createElement ("li");
      let itemEditButton = document.createElement ("div");
      itemEditButton.textContent = "Edit Project";
      itemEditButton.onclick = loadEditProjectView;
      titleEditItem.appendChild (itemEditButton);
      titleDropDownMenu.appendChild (titleDeleteItem);
      titleDropDownMenu.appendChild (titleEditItem);
      let spacing = document.createElement ("span");
      spacing.innerHTML = "&nbsp;";
      let titleAddButton = document.createElement ("button");
      titleAddButton.textContent = "\uFF0B";
      titleAddButton.onclick = LoadNewItemView;
      title.appendChild (titleTitle);
      title.appendChild (titleCompletion);
      title.appendChild (titleDivider);
      title.appendChild (sortText);
      title.appendChild (sortOption);
      title.appendChild (titleDivider2);
      title.appendChild (titleDropDownBtn);
      title.appendChild (titleDropDownMenu);
      title.appendChild (spacing);
      title.appendChild (titleAddButton);
      mainContainer.appendChild (title);

      // Create container for list of items
      let itemsContainer = document.createElement ("ul");
      itemsContainer.id = "itemsContainer";

      // Create and append each item to the list
      for (let i = 0; i < project.getNumItems(); i++) {

         // Get current item object
         let itemObj = project.getListItem (i);

         // Create item listing
         let itemListing = document.createElement ("li");
         itemListing.className = "itemListing";
         itemListing.onclick = function() {toggleExpandItemInfo (i)};
         let itemCheck = document.createElement ("input");
         itemCheck.type = "checkbox";
         itemCheck.checked = master.getItemCompletion (itemObj.getID(), currentProjectIndex);
         itemCheck.onclick = function (evt) {
            evt.stopPropagation();
            master.toggleItemCompletion (itemObj.getID(), currentProjectIndex);
            document.getElementById ("projectCompletionSpan").textContent = " (" + master.getProject(currentProjectIndex).getCompletionStatus() + ")";
            saveAppData();
         };
         let itemTitle = document.createElement ("span");
         itemTitle.id = "itemTitle";
         itemTitle.className = "itemTitle";
         itemTitle.textContent = itemObj.getTitle();
         let itemOptions = document.createElement ("span");
         itemOptions.className = "itemListingFloating";
         itemOptions.textContent = " | \u22EE";
         itemOptions.onclick = function (evt) {
            evt.stopPropagation();
            toggleItemDropDown (i);
         };
         let itemOptionsList = document.createElement ("ul");
         itemOptionsList.id = "itemDropDown" + i;
         itemOptionsList.className = "itemDropDown";
         itemOptionsList.style.display = "none";
         let itemDeleteItem = document.createElement ("li");
         let itemDeleteBtn = document.createElement ("div");
         itemDeleteBtn.textContent = "Delete";
         itemDeleteBtn.onclick = function (evt) {
            evt.stopPropagation();
            toggleItemDropDown (i);
            RemoveItem (itemObj.getID(), currentProjectIndex);
         };
         itemDeleteItem.appendChild (itemDeleteBtn);
         let itemEditItem = document.createElement ("li");
         let itemEditBtn = document.createElement ("div");
         itemEditBtn.textContent = "Edit";
         itemEditBtn.onclick = function (evt) {
            evt.stopPropagation();
            toggleItemDropDown (i);
            loadEditItemView (i);
         };
         itemEditItem.appendChild (itemEditBtn);
         itemOptionsList.appendChild (itemDeleteItem);
         itemOptionsList.appendChild (itemEditItem);
         itemListing.appendChild (itemCheck);
         itemListing.appendChild (itemTitle);
         itemListing.appendChild (itemOptions);
         itemListing.appendChild (itemOptionsList);
         itemsContainer.appendChild (itemListing);

         // Create item information panel
         let itemInfoPanel = document.createElement ("div");
         itemInfoPanel.className = "itemInfo";
         let itemInfoList = document.createElement ("ul");
         let itemInfoDescription = document.createElement ("li");
         itemInfoDescription.innerHTML = "<b>Description:</b> " + itemObj.getDescription();
         itemInfoList.appendChild (itemInfoDescription);
         let itemInfoDueDate = document.createElement ("li");
         itemInfoDueDate.innerHTML = "<b>Due date:</b> " + itemObj.getDueDate();
         itemInfoList.appendChild (itemInfoDueDate);
         let itemInfoPriority = document.createElement ("li");
         itemInfoPriority.innerHTML = "<b>Priority:</b> " + itemObj.getPriority();
         itemInfoList.appendChild (itemInfoPriority);
         itemInfoPanel.appendChild (itemInfoList);
         itemsContainer.appendChild (itemInfoPanel);
      }

      // Append list to container
      mainContainer.appendChild (itemsContainer);
   }

   // Load menu to edit a project
   function loadEditProjectView() {

      // Add dimmer
      addDimmer();

      // Create view container
      let menuContainer = document.createElement ("div");
      menuContainer.id = "editProjectMenu";
      menuContainer.className = "floatingMenu";

      // Create menu title
      let menuTitle = document.createElement ("h3");
      menuTitle.textContent = "Edit Project " + master.getProject (currentProjectIndex).getTitle();
      menuContainer.appendChild (menuTitle);

      // Create project title container
      let projectTitleContainer = document.createElement ("p");

      // Create project title label
      let projectTitleLabel = document.createElement ("label");
      projectTitleLabel.textContent = "Title:";
      projectTitleLabel.for = "projectTitle";
      projectTitleContainer.appendChild (projectTitleLabel);

      // Create project title textbox
      let projectTitleTextbox = document.createElement ("input");
      projectTitleTextbox.type = "text";
      projectTitleTextbox.id = "newProjectTitle";
      projectTitleTextbox.placeholder = "New Project";
      projectTitleContainer.appendChild (projectTitleTextbox);

      // Append project title conatiner to menu container
      menuContainer.appendChild (projectTitleContainer);

      // Create button to save new project information
      let projectEdit = document.createElement ("button");
      projectEdit.textContent = "Save";
      projectEdit.onclick = function() {EditProject (currentProjectIndex)};
      menuContainer.appendChild (projectEdit);

      // Create some spacing between the two buttons
      let spacing = document.createElement ("span");
      spacing.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
      menuContainer.appendChild (spacing);

      // Create button to cancel project edit
      let projectCancel = document.createElement ("button");
      projectCancel.textContent = "Cancel";
      projectCancel.onclick = UnloadEditProjectView;
      menuContainer.appendChild (projectCancel);

      // Append view container to main container
      mainContainer.appendChild (menuContainer);
   }

   // Edit a project from the edit project menu
   function EditProject (projectIndex) {

      // Get information for project
      let newProjectTitle = document.getElementById ("newProjectTitle").value;

      // Edit the project
      master.editProject (projectIndex, newProjectTitle);

      // Unload edit project and refresh project view
      LoadProjectView (projectIndex);

      // Save current app information
      saveAppData();
   }

   // Cancel and get rid of menu to edit a new project
   function UnloadEditProjectView() {

      // Get edit project menu
      let editProjectMenu = document.getElementById ("editProjectMenu");

      // Continue if the menu exists
      if (editProjectMenu !== null) {
         mainContainer.removeChild (editProjectMenu);
      }

      // Remove dimmer
      removeDimmer();
   }

   //Load menu to add a TODO item
   function LoadNewItemView() {

      // Add dimmer
      addDimmer();

      // Create the view container
      let menuContainer = document.createElement ("div");
      menuContainer.id = "newItemMenu";
      menuContainer.className = "floatingMenu";

      // Create menu title
      let menuTitle = document.createElement ("h3");
      menuTitle.textContent = "New TODO Item";
      menuContainer.appendChild (menuTitle);

      // Create new item title conatiner
      let newItemTitleContainer = document.createElement ("p");

      // Create new item title label
      let newItemTitleLabel = document.createElement ("label");
      newItemTitleLabel.textContent = "Title: ";
      newItemTitleLabel.for = "newItemTitle";
      newItemTitleContainer.appendChild (newItemTitleLabel);

      // Create new item title textbox
      let newItemTitleTextbox = document.createElement ("input");
      newItemTitleTextbox.type = "text";
      newItemTitleTextbox.id = "newItemTitle";
      newItemTitleTextbox.placeholder = "New TODO Item";
      newItemTitleContainer.appendChild (newItemTitleTextbox);

      // Append new item title container to menu container
      menuContainer.appendChild (newItemTitleContainer);

      // Create new item description container
      let newItemDescriptionContainer = document.createElement ("p");

      // Create new item description label
      let newItemDescriptionLabel = document.createElement ("label");
      newItemDescriptionLabel.textContent = "Description: ";
      newItemDescriptionLabel.for = "newItemDescription";
      newItemDescriptionContainer.appendChild (newItemDescriptionLabel);

      // Create new item description textbox
      let newItemDescriptionTextbox = document.createElement ("input");
      newItemDescriptionTextbox.type = "text";
      newItemDescriptionTextbox.id = "newItemDescription";
      newItemDescriptionContainer.appendChild (newItemDescriptionTextbox);

      // Append new item description container to menu container
      menuContainer.appendChild (newItemDescriptionContainer);

      // Create new item due date container
      let newItemDueDateContainer = document.createElement ("p");

      // Create new item due date label
      let newItemDueDateLabel = document.createElement ("label");
      newItemDueDateLabel.textContent = "Due Date: ";
      newItemDueDateLabel.for = "newItemDueDate";
      newItemDueDateContainer.appendChild (newItemDueDateLabel);

      // Create new item due date input
      let newItemDueDateInput = document.createElement ("input");
      newItemDueDateInput.type = "date";
      newItemDueDateInput.id = "newItemDueDate";
      newItemDueDateContainer.appendChild (newItemDueDateInput);

      // Append new item due date container to menu container
      menuContainer.appendChild (newItemDueDateContainer);

      // Create new item priority container
      let newItemPriorityContainer = document.createElement ("p");

      // Create new item priority label
      let newItemPriorityLabel = document.createElement ("label");
      newItemPriorityLabel.textContent = "Priority: ";
      newItemPriorityLabel.for = "newItemPriority";
      newItemPriorityContainer.appendChild (newItemPriorityLabel);

      // Create mew item priority option select
      let newItemPrioritySelect = document.createElement ("select");
      newItemPrioritySelect.id = "newItemPriority";
      for (let i = 0; i < 5; i++) {
         let newItemPriorityOption = document.createElement ("option");
         newItemPriorityOption.textContent = i;
         newItemPriorityOption.value = i;
         newItemPrioritySelect.appendChild (newItemPriorityOption);
      }
      newItemPriorityContainer.appendChild (newItemPrioritySelect);

      // Append new item priority container to menu container
      menuContainer.appendChild (newItemPriorityContainer);

      // Create button to create the new item
      let newItemCreate = document.createElement ("button");
      newItemCreate.textContent = "Create";
      newItemCreate.onclick = CreateNewItem;
      menuContainer.appendChild (newItemCreate);

      // Create some spacing between the two buttons
      let spacing = document.createElement ("span");
      spacing.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
      menuContainer.appendChild (spacing);

      // Create button to cancel new item
      let newItemCancel = document.createElement ("button");
      newItemCancel.textContent = "Cancel";
      newItemCancel.onclick = UnloadNewItemView;
      menuContainer.appendChild (newItemCancel);

      // Append view container to main container
      mainContainer.appendChild (menuContainer);
   }

   // Create a new item from the new item menu
   function CreateNewItem() {

      // Get information for new item
      let newItemTitle       = document.getElementById ("newItemTitle").value;
      let newItemDescription = document.getElementById ("newItemDescription").value;
      let newItemDueDate     = document.getElementById ("newItemDueDate").value;
      let newItemPriority    = document.getElementById ("newItemPriority").value;

      // Create new item
      master.addItemToProject (currentProjectIndex, newItemTitle, newItemDescription, newItemDueDate, newItemPriority);

      // Unload new item menu and refresh main view
      LoadProjectView (currentProjectIndex);

      // Save current app information
      saveAppData();
   }

   // Cancel and get rid of menu to add a new item
   function UnloadNewItemView() {

      // Get new item menu
      let newItemMenu = document.getElementById ("newItemMenu");

      // Continue if the menu exists
      if (newItemMenu !== null) {
         mainContainer.removeChild (newItemMenu);
      }

      // Remove dimmer
      removeDimmer();
   }

   //Load menu to add a TODO item
   function loadEditItemView (itemIndex) {

      // Add dimmer
      addDimmer();

      // Get item to edit
      item = master.getProject (currentProjectIndex).getListItem (itemIndex);

      // Create the view container
      let menuContainer = document.createElement ("div");
      menuContainer.id = "editItemMenu";
      menuContainer.className = "floatingMenu";

      // Create menu title
      let menuTitle = document.createElement ("h3");
      menuTitle.textContent = "Edit Item '" + item.getTitle() + "'";
      menuContainer.appendChild (menuTitle);

      // Create item title conatiner
      let itemTitleContainer = document.createElement ("p");

      // Create item title label
      let itemTitleLabel = document.createElement ("label");
      itemTitleLabel.textContent = "Title: ";
      itemTitleLabel.for = "editItemTitle";
      itemTitleContainer.appendChild (itemTitleLabel);

      // Create item title textbox
      let itemTitleTextbox = document.createElement ("input");
      itemTitleTextbox.type = "text";
      itemTitleTextbox.id = "editItemTitle";
      itemTitleTextbox.value = item.getTitle();
      itemTitleContainer.appendChild (itemTitleTextbox);

      // Append item title container to menu container
      menuContainer.appendChild (itemTitleContainer);

      // Create item description container
      let itemDescriptionContainer = document.createElement ("p");

      // Create item description label
      let itemDescriptionLabel = document.createElement ("label");
      itemDescriptionLabel.textContent = "Description: ";
      itemDescriptionLabel.for = "editItemDescription";
      itemDescriptionContainer.appendChild (itemDescriptionLabel);

      // Create item description textbox
      let itemDescriptionTextbox = document.createElement ("input");
      itemDescriptionTextbox.type = "text";
      itemDescriptionTextbox.id = "editItemDescription";
      itemDescriptionTextbox.value = item.getDescription();
      itemDescriptionContainer.appendChild (itemDescriptionTextbox);

      // Append item description container to menu container
      menuContainer.appendChild (itemDescriptionContainer);

      // Create item due date container
      let itemDueDateContainer = document.createElement ("p");

      // Create item due date label
      let itemDueDateLabel = document.createElement ("label");
      itemDueDateLabel.textContent = "Due Date: ";
      itemDueDateLabel.for = "editItemDueDate";
      itemDueDateContainer.appendChild (itemDueDateLabel);

      // Create item due date input
      let itemDueDateInput = document.createElement ("input");
      itemDueDateInput.type = "date";
      itemDueDateInput.id = "editItemDueDate";
      itemDueDateInput.value = item.getDueDate();
      itemDueDateContainer.appendChild (itemDueDateInput);

      // Append item due date container to menu container
      menuContainer.appendChild (itemDueDateContainer);

      // Create item priority container
      let itemPriorityContainer = document.createElement ("p");

      // Create item priority label
      let itemPriorityLabel = document.createElement ("label");
      itemPriorityLabel.textContent = "Priority: ";
      itemPriorityLabel.for = "editItemPriority";
      itemPriorityContainer.appendChild (itemPriorityLabel);

      // Create item priority option select
      let itemPrioritySelect = document.createElement ("select");
      itemPrioritySelect.id = "editItemPriority";
      for (let i = 0; i < 5; i++) {
         let itemPriorityOption = document.createElement ("option");
         itemPriorityOption.textContent = i;
         itemPriorityOption.value = i.toString();
         itemPrioritySelect.appendChild (itemPriorityOption);
      }
      itemPrioritySelect.value = item.getPriority();
      itemPriorityContainer.appendChild (itemPrioritySelect);

      // Append item priority container to menu container
      menuContainer.appendChild (itemPriorityContainer);

      // Create button to edit the item
      let itemEdit = document.createElement ("button");
      itemEdit.textContent = "Edit";
      itemEdit.onclick = function() {EditItem (item.getID(), item.getParentProject())};
      menuContainer.appendChild (itemEdit);

      // Create some spacing between the two buttons
      let spacing = document.createElement ("span");
      spacing.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
      menuContainer.appendChild (spacing);

      // Create button to cancel edit item
      let editItemCancel = document.createElement ("button");
      editItemCancel.textContent = "Cancel";
      editItemCancel.onclick = UnloadEditItemView;
      menuContainer.appendChild (editItemCancel);

      // Append view container to main container
      mainContainer.appendChild (menuContainer);
   }

   // Edit an item from the edit item menu
   function EditItem (itemID, itemParentProjectIndex) {

      // Get information for edited item
      let itemTitle       = document.getElementById ("editItemTitle").value;
      let itemDescription = document.getElementById ("editItemDescription").value;
      let itemDueDate     = document.getElementById ("editItemDueDate").value;
      let itemPriority    = document.getElementById ("editItemPriority").value;

      // Edit item
      master.editItem (itemParentProjectIndex, itemID, itemTitle, itemDescription, itemDueDate, itemPriority);

      // Unload edit item menu and refresh main view
      if (currentProjectIndex < 0) {
         loadAllItemsView();
      } else {
         LoadProjectView (currentProjectIndex);
      }

      // Save current app information
      saveAppData();
   }

   // Cancel and get rid of menu to edit an item
   function UnloadEditItemView() {

      // Get nedit item menu
      let editItemMenu = document.getElementById ("editItemMenu");

      // Continue if the menu exists
      if (editItemMenu !== null) {
         mainContainer.removeChild (editItemMenu);
      }

      // Remove dimmer
      removeDimmer();
   }

   // Load main page with all items
   function loadAllItemsView() {

      // Update internal variable
      currentProjectIndex = -1;

      // Erase DOM from main conatiner
      UnloadViews();

      // Create view title
      let title = document.createElement ("h2");
      let titleText = document.createTextNode ("All TODO items | ");
      let titleAddButton = document.createElement ("button");
      titleAddButton.textContent = "\uFF0B";
      titleAddButton.onclick = LoadNewProjectView;
      let titleDivider = document.createTextNode (" | ");
      let titleShowAllItemsButton = document.createElement ("button");
      titleShowAllItemsButton.textContent = "Show all projects";
      titleShowAllItemsButton.onclick = LoadMainView;
      let titleDivider2 = document.createTextNode (" | ");
      let sortText = document.createTextNode ("Sort by ");
      let sortOption = document.createElement ("select");
      sortOption.id = "itemSortOption";
      let sortCreationUp = document.createElement ("option");
      sortCreationUp.value = "creationUp";
      sortCreationUp.textContent = "order of creation ↑";
      sortOption.appendChild (sortCreationUp);
      let sortCreationDown = document.createElement ("option");
      sortCreationDown.value = "creationDown";
      sortCreationDown.textContent = "order of creation ↓";
      sortOption.appendChild (sortCreationDown);
      let sortPriorityUp = document.createElement ("option");
      sortPriorityUp.value = "priorityUp";
      sortPriorityUp.textContent = "item priority ↑";
      sortOption.appendChild (sortPriorityUp);
      let sortPriorityDown = document.createElement ("option");
      sortPriorityDown.value = "priorityDown";
      sortPriorityDown.textContent = "item priority ↓";
      sortOption.appendChild (sortPriorityDown);
      let sortDueDateUp = document.createElement ("option");
      sortDueDateUp.value = "dueDateUp";
      sortDueDateUp.textContent = "due date ↑";
      sortOption.appendChild (sortDueDateUp);
      let sortDueDateDown = document.createElement ("option");
      sortDueDateDown.value = "dueDateDown";
      sortDueDateDown.textContent = "due date ↓";
      sortOption.appendChild (sortDueDateDown);
      sortOption.onchange = function() {
         sortCriterion = sortOption.value;
         master.sortProjectItems (sortCriterion);
         loadAllItemsView();
         saveAppData();
         saveExtraAppData();
      };
      sortOption.value = sortCriterion;
      title.appendChild (titleText);
      title.appendChild (titleAddButton);
      title.appendChild (titleDivider);
      title.appendChild (titleShowAllItemsButton);
      title.appendChild (titleDivider2);
      title.appendChild (sortText);
      title.appendChild (sortOption);
      mainContainer.appendChild (title);

      // Prepare ghost project
      let project = master.rebuildGhostProject();
      project.sortItemsBy (sortCriterion);

      // Create container for list of items
      let itemsContainer = document.createElement ("ul");
      itemsContainer.id = "itemsContainer";

      // Create and append each item to the list
      for (let i = 0; i < project.getNumItems(); i++) {

         // Get current item object
         let itemObj = project.getListItem (i);

         // Create item listing
         let itemListing = document.createElement ("li");
         itemListing.className = "itemListing";
         itemListing.onclick = function() {toggleExpandItemInfo (i)};
         let itemCheck = document.createElement ("input");
         itemCheck.type = "checkbox";
         itemCheck.checked = master.getItemCompletion (itemObj.getID(), itemObj.getParentProject());
         itemCheck.onclick = function (evt) {
            evt.stopPropagation();
            master.toggleItemCompletion (itemObj.getID(), itemObj.getParentProject());
            saveAppData();
         };
         let itemTitle = document.createElement ("span");
         itemTitle.id = "itemTitle";
         itemTitle.className = "itemTitle";
         itemTitle.textContent = itemObj.getTitle();
         let itemOptions = document.createElement ("span");
         itemOptions.className = "itemListingFloating";
         itemOptions.textContent = " | \u22EE";
         itemOptions.onclick = function (evt) {
            evt.stopPropagation();
            toggleItemDropDown (i);
         };
         let itemOptionsList = document.createElement ("ul");
         itemOptionsList.id = "itemDropDown" + i;
         itemOptionsList.className = "itemDropDown";
         itemOptionsList.style.display = "none";
         let itemDeleteItem = document.createElement ("li");
         let itemDeleteBtn = document.createElement ("div");
         itemDeleteBtn.textContent = "Delete";
         itemDeleteBtn.onclick = function (evt) {
            evt.stopPropagation();
            toggleItemDropDown (i);
            RemoveItem (itemObj.getID(), itemObj.getParentProject());
         };
         itemDeleteItem.appendChild (itemDeleteBtn);
         let itemEditItem = document.createElement ("li");
         let itemEditBtn = document.createElement ("div");
         itemEditBtn.textContent = "Edit";
         itemEditBtn.onclick = function (evt) {
            evt.stopPropagation();
            toggleItemDropDown (i);
            loadEditItemView (i);
         };
         itemEditItem.appendChild (itemEditBtn);
         itemOptionsList.appendChild (itemDeleteItem);
         itemOptionsList.appendChild (itemEditItem);
         itemListing.appendChild (itemCheck);
         itemListing.appendChild (itemTitle);
         itemListing.appendChild (itemOptions);
         itemListing.appendChild (itemOptionsList);
         itemsContainer.appendChild (itemListing);

         // Create item information panel
         let itemInfoPanel = document.createElement ("div");
         itemInfoPanel.className = "itemInfo";
         let itemInfoList = document.createElement ("ul");
         let itemInfoDescription = document.createElement ("li");
         itemInfoDescription.innerHTML = "<b>Description:</b> " + itemObj.getDescription();
         itemInfoList.appendChild (itemInfoDescription);
         let itemInfoDueDate = document.createElement ("li");
         itemInfoDueDate.innerHTML = "<b>Due date:</b> " + itemObj.getDueDate();
         itemInfoList.appendChild (itemInfoDueDate);
         let itemInfoPriority = document.createElement ("li");
         itemInfoPriority.innerHTML = "<b>Priority:</b> " + itemObj.getPriority();
         itemInfoList.appendChild (itemInfoPriority);
         itemInfoPanel.appendChild (itemInfoList);
         itemsContainer.appendChild (itemInfoPanel);
      }

      // Append list to container
      mainContainer.appendChild (itemsContainer);
   }

   // Toggle expanded view of TODO item
   function toggleExpandItemInfo (itemIndex) {

      // Get item container to expand
      let itemInfoPanel = document.querySelectorAll ("#itemsContainer > div")[itemIndex];
      let itemListing = itemInfoPanel.previousElementSibling;
      let itemTitle = itemListing.getElementsByClassName ("itemTitle")[0];
      if (itemTitle === undefined) {
         itemTitle = itemListing.getElementsByClassName ("itemTitleExpanded")[0];
      }
      let itemDeleteButton = itemListing.getElementsByClassName ("itemListingFloating")[0];
      if (itemDeleteButton === undefined) {
         itemDeleteButton = itemListing.getElementsByClassName ("itemListingFloatingActive")[0];
      }

      // Change CSS class depending on toggle status
      if (itemInfoPanel.className == "itemInfo") {
         itemInfoPanel.className = "itemInfoExpanded";
         itemTitle.className = "itemTitleExpanded";
         itemDeleteButton.className = "itemListingFloatingActive";
      } else {
         itemInfoPanel.className = "itemInfo";
         itemTitle.className = "itemTitle";
         itemDeleteButton.className = "itemListingFloating";
      }
   }

   // Toggle drop down menu for project view
   function toggleProjectDropDown() {

      // Get menu
      let menu = document.getElementById ("projectDropDown");

      // Get button
      let button = menu.previousElementSibling;

      // Toggle menu visibility
      if (menu.style.display == "none") {
         menu.style.display = "block";
         menu.style.left = button.offsetLeft + "px";
      } else {
         menu.style.display = "none";
      }
   }

   // Toggle drop down menu for an item
   function toggleItemDropDown (itemIndex) {

      // Get menu
      let menu = document.getElementById ("itemDropDown" + itemIndex);

      // Get button
      let button = menu.previousElementSibling;

      // Toggle menu visibility
      if (menu.style.display == "none") {
         menu.style.display = "block";
         menu.style.left = button.offsetLeft + "px";
      } else {
         menu.style.display = "none";
      }
   }

   // Remove an item from a project
   function RemoveItem (itemID, projectIndex) {

      // Proceed after user confirmation
      if (!window.confirm ("Are you sure you want to delete this item?")) {
         return;
      }

      // Delete the item
      master.removeItemFromProject (itemID, projectIndex);

      // Reload the project view (or all items view)
      if (currentProjectIndex < 0) {
         loadAllItemsView();
      } else {
         LoadProjectView (currentProjectIndex);
      }

      // Save current app information
      saveAppData();
   }

   // Remove a project
   function RemoveProject (projectIndex) {

      // Proceed after user confirmation
      if (!window.confirm ("Are you sure wou want to delete this project?")) {
         return;
      }

      // Delete the project
      master.removeProject (projectIndex);

      // Reload the main view
      LoadMainView();

      // Save current app information
      saveAppData();
   }

   // Save the main current app data to local storage
   function saveAppData() {
      localStorage.setItem ('SimpleTODO', master.getJSON());
   }

   // Save the secondary current app data to local storage
   function saveExtraAppData() {

      // Theme setting
      localStorage.setItem ('SimpleTODOTheme', currentTheme);

      // Show project completion status setting
      localStorage.setItem ('SimpleTODOShowCompletion', showCompletionSetting);

      // Item sort critetion
      localStorage.setItem ('SimpleTODOSortCriterion', sortCriterion);
   }

   // Load a saved data from the local storage (if existent)
   function LoadAppData() {

      // TODO data
      if (localStorage.getItem ('SimpleTODO')) {
         master.loadFromJSON (localStorage.getItem ('SimpleTODO'));
      }

      // Theme setting
      if (localStorage.getItem ('SimpleTODOTheme')) {
         currentTheme = parseInt (localStorage.getItem ('SimpleTODOTheme'));
      }

      // Show project completion status setting
      if (localStorage.getItem ('SimpleTODOShowCompletion')) {
         showCompletionSetting = (localStorage.getItem ('SimpleTODOShowCompletion') == "true");
      }

      // Item sort criterion
      if (localStorage.getItem ('SimpleTODOSortCriterion')) {
         sortCriterion = (localStorage.getItem ('SimpleTODOSortCriterion'));
      }

      // Apply saved settings

      // Theme
      ChangeTheme (currentTheme);
      document.getElementById ("themeSelector").value = currentTheme;

      // Show project completion status
      document.getElementById ("showCompletionSetting").checked = showCompletionSetting;
   }

   // Change the color scheme of the app
   function ChangeTheme (themeNumber) {

      // Keep track of current theme
      currentTheme = themeNumber;

      // Reset to default theme
      resetTheme();

      // Get container elements
      let body = document.body;
      let header = document.getElementById ("header");
      let bodydiv = document.getElementById ("body");

      // Change CSS classes depending on chosen theme
      switch (currentTheme) {
         default:
            body.classList.add ("body_scheme0");
            header.classList.add ("header_scheme0");
            bodydiv.classList.add ("bodydiv_scheme0");
            break;
         case 1:
            body.classList.add ("body_scheme1");
            header.classList.add ("header_scheme1");
            bodydiv.classList.add ("bodydiv_scheme1");
            break;
         case 2:
            body.classList.add ("body_scheme2");
            header.classList.add ("header_scheme2");
            bodydiv.classList.add ("bodydiv_scheme2");
            break;
         case 3:
            body.classList.add ("body_scheme3");
            header.classList.add ("header_scheme3");
            bodydiv.classList.add ("bodydiv_scheme3");
            break;
         case 4:
            body.classList.add ("body_scheme4");
            header.classList.add ("header_scheme4");
            bodydiv.classList.add ("bodydiv_scheme4");
            break;
         case 5:
            body.classList.add ("body_scheme5");
            header.classList.add ("header_scheme5");
            bodydiv.classList.add ("bodydiv_scheme5");
            break;
      }

      // Save current configuration
      saveExtraAppData();
   }

   // Reset the theme of the app before applying new theme
   function resetTheme() {

      // Get container elements
      let body = document.body;
      let header = document.getElementById ("header");
      let bodydiv = document.getElementById ("body");

      // Remove css classes
      body.classList.remove ("body_scheme0");
      body.classList.remove ("body_scheme1");
      body.classList.remove ("body_scheme2");
      body.classList.remove ("body_scheme3");
      body.classList.remove ("body_scheme4");
      body.classList.remove ("body_scheme5");
      header.classList.remove ("header_scheme0");
      header.classList.remove ("header_scheme1");
      header.classList.remove ("header_scheme2");
      header.classList.remove ("header_scheme3");
      header.classList.remove ("header_scheme4");
      header.classList.remove ("header_scheme5");
      bodydiv.classList.remove ("bodydiv_scheme0");
      bodydiv.classList.remove ("bodydiv_scheme1");
      bodydiv.classList.remove ("bodydiv_scheme2");
      bodydiv.classList.remove ("bodydiv_scheme3");
      bodydiv.classList.remove ("bodydiv_scheme4");
      bodydiv.classList.remove ("bodydiv_scheme5");
   }

   // Open the settings tab
   function OpenSettings() {

      // Settings tab CSS
      document.getElementById ("settings").style.right = "0";

      // Dimming CSS
      let dimmer = document.getElementById ("dimmer");
      dimmer.style.zIndex = 2;
      dimmer.style.opacity = "0.6";
   }

   // Close the settings tab
   function CloseSettings() {

      // Settings tab CSS
      document.getElementById ("settings").style.right = "-350px";

      // Dimming CSS
      let dimmer = document.getElementById ("dimmer");
      dimmer.style.zIndex = "-1";
      dimmer.style.opacity = "0";
   }

   // Add a dimmer for floating menus
   function addDimmer() {

      // Get the dimmer
      let dimmer = document.getElementById ("dimmer");

      // CSS
      dimmer.style.zIndex = "1";
      dimmer.style.opacity = "0.6";
   }

   // Remove dimmer for floating menus
   function removeDimmer() {

      // Get the dimmer
      let dimmer = document.getElementById ("dimmer");

      // CSS
      dimmer.style.zIndex = "-1";
      dimmer.style.opacity = "0";
   }

   // Create erase data warning menu
   function LoadEraseWarningView() {

      // Get dimmer
      let dimmer = document.getElementById ("dimmer");

      // Dimmer CSS
      dimmer.style.zIndex = "5";
      dimmer.style.opacity = "0.6";

      // Create container
      let eraseWarningContainer = document.createElement ("div");
      eraseWarningContainer.id = "eraseWarningDiv";
      eraseWarningContainer.className = "eraseWarningDiv";

      // Create text
      let eraseWarningText = document.createElement ("p");
      eraseWarningText.innerHTML = "Are you sure you want to erase all project data?<br />This action cannot be undone!";
      eraseWarningContainer.appendChild (eraseWarningText);

      // Create confirm button
      let eraseConfirm = document.createElement ("button");
      eraseConfirm.textContent = "Confirm";
      eraseConfirm.onclick = function() {
         eraseTODOData();
         CloseSettings();
      };
      eraseWarningContainer.appendChild (eraseConfirm);

      // Create some spacing between the two buttons
      let spacing = document.createElement ("span");
      spacing.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
      eraseWarningContainer.appendChild (spacing);

      // Create cancel button
      let eraseCancel = document.createElement ("button");
      eraseCancel.textContent = "Cancel";
      eraseCancel.onclick = unloadEraseWarningView;
      eraseWarningContainer.appendChild (eraseCancel);

      // Attach erase warning menu to main container
      mainContainer.appendChild (eraseWarningContainer);
   }

   // Erase all TODO data and refresh main view
   function eraseTODOData() {

      // Delete all projects
      while (master.getNumProjects() > 0) {
         master.removeProject (0);
      }

      // Unload erase warning menu and refresh main view
      LoadMainView();

      // Save current app information
      saveAppData();
   }

   // Cancel and get rid of erase data warning menu
   function unloadEraseWarningView() {

      // Get new item menu
      let eraseWarningMenu = document.getElementById ("eraseWarningDiv");

      // Continue if the menu exists
      if (eraseWarningMenu !== null) {
         mainContainer.removeChild (eraseWarningMenu);
      }

      // Restore dimmer
      addDimmer();
   }

   // Toggle option to show completion status next to project title
   function ToggleShowCompletionSetting() {

      // Get whether option is selected
      showCompletionSetting = document.getElementById ("showCompletionSetting").checked;

      // Show/hide completion status
      let projectCompletionSpan = document.getElementById ("projectCompletionSpan");
      if (projectCompletionSpan) {
         if (showCompletionSetting) {
            projectCompletionSpan.className = "not-hidden";
         } else {
            projectCompletionSpan.className = "hidden";
         }
      }

      // Save settings
      saveExtraAppData();
   }

   return {UnloadViews, LoadMainView, LoadAppData, ChangeTheme, OpenSettings, CloseSettings, LoadEraseWarningView, ToggleShowCompletionSetting};
}