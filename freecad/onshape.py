# Onshape-style mouse + keyboard for FreeCAD. Run with freecadcmd (install) or in the GUI.
# Keys from https://cad.onshape.com/help/Content/shortcut_keys.htm
import FreeCAD as App

# Onshape: right-drag rotate, middle-drag pan, wheel zoom.
App.ParamGet("User parameter:BaseApp/Preferences/View").SetString(
    "NavigationStyle", "Gui::TinkerCADNavigationStyle"
)

SHORTCUTS = {
    # Part Studio
    "PartDesign_NewSketch": "Shift+S",
    "PartDesign_Pad": "Shift+E",
    "PartDesign_Revolution": "Shift+W",
    "PartDesign_Fillet": "Shift+F",
    # Sketch
    "Sketcher_CreateLine": "L",
    "Sketcher_Create3PointArc": "A",
    "Sketcher_CreateCircle": "C",
    "Sketcher_CreateRectangle_Center": "R",
    "Sketcher_Dimension": "D",
    "Sketcher_ToggleConstruction": "Q",
    "Sketcher_Trimming": "M",
    "Sketcher_Projection": "U",
    "Sketcher_Offset": "O",
    "Sketcher_ConstrainSymmetric": "Shift+Q",
    "Sketcher_ViewSketch": "N",
    # View
    "Std_ViewFitAll": "F",
    "Std_ViewFront": "Shift+1",
    "Std_ViewRear": "Shift+2",
    "Std_ViewLeft": "Shift+3",
    "Std_ViewRight": "Shift+4",
    "Std_ViewTop": "Shift+5",
    "Std_ViewBottom": "Shift+6",
    "Std_ViewIsometric": "Shift+7",
    "Std_ViewZoomIn": "Shift+Z",
    "Std_ViewZoomOut": "Z",
    "Std_ViewBoxZoom": "W",
    # Global defaults that would swallow the keys above ("A, C", "Shift+E").
    "Std_AxisCross": "",
    "Std_BoxElementSelection": "",
}

params = App.ParamGet("User parameter:BaseApp/Preferences/Shortcut")
for command, keys in SHORTCUTS.items():
    params.SetString(command, keys)
