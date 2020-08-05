//== NOTES ==//
/*

   == Current increment ==
   - Work on better UI

   == Next increment (+1) ==
   - Work on secondary features
      - Theme selector
      - Erase all TODO data
      - Item sorting
      - Show all items

   == Next increment (+2) ==
   - Buf fixing (?) (Might be done with project)

   ------------------------------------------------

   JSON app data format:
   * Array (project list)
      * Object (individual project)
         - Title: project title
         * Array (TODO list)
            * Object (individual TODO)
               - Title: TODO title
               - Description: TODO description
               - Due date: TODO due date
               - Priority: TODO priority

*/

//== Main ==//

var controller = TODOController();
window.onload = controller.LoadAppData();
controller.LoadMainView();