//== NOTES ==//
/*

   == Current increment ==
   --- Basic functionality is implemented! :) ---

   == Next increment (+1) ==
   - Work on better UI

   == Next increment (+2) ==
   - Work on secondary features

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