//== NOTES ==//
/*

   == Possible future features ==
   - Use priorities toggle (?)
   - Hide completed items toggle
   - In all items view, add additional group by project option

*/

//== Main ==//

// Create app controller
var controller = TODOController();
window.onload = controller.LoadAppData();
controller.LoadMainView();

// Open settings tab
document.getElementById ("settingsBtn").addEventListener ("click", controller.OpenSettings);

// Close settings tab
document.getElementById ("settingsCloseBtn").addEventListener ("click", controller.CloseSettings);

// Change theme setting
let themeSelector = document.getElementById ("themeSelector")
themeSelector.addEventListener ("change", function() {
   controller.ChangeTheme (parseInt(themeSelector.value));
});

// Change show project completion status setting
document.getElementById ("showCompletionSetting").addEventListener ("change", controller.ToggleShowCompletionSetting);

// Erase all data
document.getElementById ("eraseTODODataBtn").addEventListener ("click", controller.LoadEraseWarningView);