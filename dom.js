/*======================
  == DOM MANIPULATION ==
  ======================*/

//import {TODO, Project, Master} from "./todo"

var TODOController = function() {

   // == OBJECT PROPERTIES ==

   let master = Master();
   let currentProjectIndex = -1;
   let currentTheme = 0;

   // Main container
   let mainContainer = document.getElementById ("body");

   // == OBJECT METHODS ==

   // Unload any DOM attached to the main container
   function UnloadViews() {

      // Get container
      let container = document.getElementById ("body");

      // Erase everything
      container.textContent = "";
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
      titleAddButton.textContent = "Create New Project";
      titleAddButton.onclick = LoadNewProjectView;
      title.appendChild (titleText);
      title.appendChild (titleAddButton);
      mainContainer.appendChild (title);

      // Create container for list of projects
      let listContainer = document.createElement ("ul");

      // Create and append each project from the list
      for (let i = 0; i < master.getNumProjects(); i++) {

         // Create list item with project title
         let projectListing = document.createElement ("li");
         projectListing.className = "projectListing";
         let projectTitle = document.createElement ("span");
         projectTitle.textContent = master.getProject (i).getTitle();
         projectTitle.onclick = function() {LoadProjectView (i)};
         projectListing.appendChild (projectTitle);
         let projectDeleteButton = document.createElement ("span");
         projectDeleteButton.className = "projectListingFloating";
         projectDeleteButton.textContent = " | Delete";
         projectDeleteButton.onclick = function() {RemoveProject (i)};
         projectListing.appendChild (projectDeleteButton);
         listContainer.appendChild (projectListing);
      }

      // Append list to container
      mainContainer.appendChild (listContainer);
   }

   // Load menu to add a project
   function LoadNewProjectView() {

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
      newProjectTitleLabel.textContent = "Title: ";
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
      let titleText = document.createTextNode (project.getTitle() + " | ");
      let titleAddButton = document.createElement ("button");
      titleAddButton.textContent = "Create New Item";
      titleAddButton.onclick = LoadNewItemView;
      title.appendChild (titleText);
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
         let itemTitle = document.createElement ("span");
         itemTitle.id = "itemTitle";
         itemTitle.className = "itemTitle";
         itemTitle.textContent = itemObj.getTitle();
         let itemDeleteButton = document.createElement ("span");
         itemDeleteButton.className = "itemListingFloating";
         itemDeleteButton.textContent = " | Delete";
         itemDeleteButton.onclick = function() {
            RemoveItem (i, currentProjectIndex);
         };
         itemListing.appendChild (itemTitle);
         itemListing.appendChild (itemDeleteButton);
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

   //Load menu to add a TODO item
   function LoadNewItemView() {

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
   }

   // Toggle expanded view of TODO item
   function toggleExpandItemInfo (itemIndex) {

      // Get item container to expand
      let itemInfoPanel = document.getElementById ("itemsContainer").getElementsByTagName ("div")[itemIndex];
      let itemListing = itemInfoPanel.previousElementSibling;
      let itemTitle = itemListing.getElementsByClassName ("itemTitle")[0];
      if (itemTitle === undefined) {
         itemTitle = itemListing.getElementsByClassName ("itemTitleExpanded")[0];
      }

      // Change CSS class depending on toggle status
      if (itemInfoPanel.className == "itemInfo") {
         itemInfoPanel.className = "itemInfoExpanded";
         itemTitle.className = "itemTitleExpanded";
      } else {
         itemInfoPanel.className = "itemInfo";
         itemTitle.className = "itemTitle";
      }
   }

   // Remove an item from a project
   function RemoveItem (itemIndex, projectIndex) {

      // Proceed after user confirmation
      if (!window.confirm ("Are you sure you want to delete this item?")) {
         return;
      }

      // Delete the item
      master.removeItemFromProject (itemIndex, projectIndex);

      // Reload the project view
      LoadProjectView (currentProjectIndex);

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
      localStorage.setItem ('SimpleTODOTheme', currentTheme);
   }

   // Load a saved data from the local storage (if existent)
   function LoadAppData() {
      if (localStorage.getItem ('SimpleTODO')) {
         master.loadFromJSON (localStorage.getItem ('SimpleTODO'));
      }
      if (localStorage.getItem ('SimpleTODOTheme')) {
         currentTheme = parseInt (localStorage.getItem ('SimpleTODOTheme'));
      }
      ChangeTheme (currentTheme);
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

   return {UnloadViews, LoadMainView, LoadAppData, ChangeTheme};
}