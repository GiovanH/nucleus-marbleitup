// Marble It Up! Ultra - Nucleus Co-Op handler

// Rename global mutex to allow multiple instances
Game.ProtoInput.RenameHandlesHook = true;
Game.ProtoInput.RenameHandles = ["CDdf212806D6EmB31yE0c"];
Game.ProtoInput.RenameNamedPipes = [];

// Do not enable: crashes Nucleus under InjectStartup
Game.ForwardWindowToProtoInput = false;

// Doesn't include LocalLow isolation, which is the main required isolation mechanic for Marble
Game.UseNucleusEnvironment = true;

// Required since NucleusEnvironment doesn't include locallow
Game.LaunchAsDifferentUsers = true;
Game.TransferNucleusUserAccountProfiles = true;

// Marble servers are OK with unauthenticated goldberg profiles (for now)
Game.UseGoldberg = true;

Game.HandlerInterval = 100;
Game.ExecutableName = "Marble It Up.exe";
Game.SteamID = "864060";
Game.GUID = "MarbleItUpUltra";
Game.GameName = "Marble It Up! Ultra";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.SymlinkGame = true;
Game.SymlinkExe = false;
Game.HardcopyGame = false;
Game.KeepSymLinkOnExit = true;
Game.SupportsKeyboard = false;
Game.SupportsPositioning = true;
Game.HideTaskbar = false;

// --- Input ---
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.Hook.XInputNames = ["xinput1_3.dll"];
Game.XInputPlusDll = [];
Game.UseManualProtoControllersSetup = true;
Game.ProtoInput.MultipleProtoControllers = true;
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = true;
// must be false — conflicts with XInputPlusDll
Game.Hook.CustomDllEnabled = false;  

// Real focus-faking is done with FocusHooks
Game.Hook.ForceFocus = true;
Game.Hook.ForceFocusWindowName = "MarbleItUpUltra"; 
Game.Hook.BlockKeyboardEvents = true;
Game.Hook.BlockMouseEvents = true;
Game.Hook.BlockInputEvents = true;

// Breaks things
Game.FakeFocus = false;

Game.SupportsMultipleKeyboardsAndMice = false;

// Only use ProtoInput
Game.HookSetCursorPos = false;
Game.HookGetCursorPos = false;
Game.HookGetKeyState = false;
Game.HookGetAsyncKeyState = false;
Game.HookGetKeyboardState = false;
Game.HookFilterRawInput = false;
Game.HookFilterMouseMessages = false;
Game.HookUseLegacyInput = false;
Game.HookDontUpdateLegacyInMouseMsg = false;
Game.HookMouseVisibility = false;
Game.SendNormalMouseInput = false;
Game.SendNormalKeyboardInput = false;
Game.SendScrollWheel = false;
Game.ForwardRawKeyboardInput = false;
Game.ForwardRawMouseInput = false;
Game.HookReRegisterRawInput = false;
Game.HookReRegisterRawInputMouse = false;
Game.HookReRegisterRawInputKeyboard = false;
Game.DrawFakeMouseCursor = false;

Game.ProtoInput.InjectStartup = true;
Game.ProtoInput.InjectRuntime_EasyHookMethod = false;
Game.ProtoInput.InjectRuntime_RemoteLoadMethod = false;
Game.ProtoInput.InjectRuntime_EasyHookStealthMethod = false;

Game.LockInputAtStart = false;
Game.LockInputSuspendsExplorer = true;
Game.LockInputToggleKey = 0x23; // END

Game.ProtoInput.RegisterRawInputHook = true;
Game.ProtoInput.GetRawInputDataHook = true;
Game.ProtoInput.MessageFilterHook = true;
Game.ProtoInput.GetCursorPosHook = true;
Game.ProtoInput.SetCursorPosHook = true;
Game.ProtoInput.GetKeyStateHook = true;
Game.ProtoInput.GetAsyncKeyStateHook = true;
Game.ProtoInput.GetKeyboardStateHook = true;
Game.ProtoInput.CursorVisibilityHook = true;

Game.ProtoInput.FocusHooks = true;
Game.ProtoInput.DrawFakeCursor = true;
Game.ProtoInput.ClipCursorHook = false;
Game.ProtoInput.ClipCursorHookCreatesFakeClip = false; 

Game.ProtoInput.RawInputFilter = true;
Game.ProtoInput.MouseActivateFilter = true;
Game.ProtoInput.WindowActivateFilter = true;
Game.ProtoInput.WindowActvateAppFilter = false;  // sic
Game.ProtoInput.MouseWheelFilter = true;
Game.ProtoInput.MouseButtonFilter = true;
// False so real typed characters (WM_KEYDOWN/KEYUP/CHAR) reach whichever window has
// real OS focus, needed for entering online-matchmaking room codes.
Game.ProtoInput.KeyboardButtonFilter = false;

Game.ProtoInput.SendMouseWheelMessages = true;
Game.ProtoInput.SendMouseButtonMessages = true;
Game.ProtoInput.SendMouseMovementMessages = true;
// paired with KeyboardButtonFilter
Game.ProtoInput.SendKeyboardButtonMessages = false; 

Game.ProtoInput.XinputHook = true;

Game.ProtoInput.UseOpenXinput = true;
Game.ProtoInput.UseDinputRedirection = false;
Game.ProtoInput.DinputDeviceHook = true;

Game.ProtoInput.EnableFocusMessageLoop = true;
Game.ProtoInput.FocusLoopIntervalMilliseconds = 5;
Game.ProtoInput.FocusLoop_WM_ACTIVATE = false;
Game.ProtoInput.FocusLoop_WM_ACTIVATEAPP = false;
Game.ProtoInput.FocusLoop_WM_NCACTIVATE = false;
Game.ProtoInput.FocusLoop_WM_SETFOCUS = false;
Game.ProtoInput.FocusLoop_WM_MOUSEACTIVATE = false;

Game.ProtoInput.CreateSingleHIDHook = false;

// --- Resolution / window ---
// Unity standalone command-line args
Game.StartArguments = "-screen-fullscreen 0 -popupwindow";

Game.Description =
  "Marble it Up! does not support LAN multiplayer. This currently works, but relies on using Marble it Up's live online matchmaking. Start a private match and manually connect by code, using Alt+Tab to focus a game window and typing in the code with a keyboard.";

Game.Play = function () {
  // A borderless (-popupwindow) window whose bounds exactly match a monitor's full
  // resolution gets auto-detected by Windows/DWM as "fullscreen," which breaks
  // background-window input handling in a one-monitor-per-player layout
  // Shrinking by 1px avoids the fullscreen auto-classification
  // Must be done on PlayerInfo.MonitorBounds directly
  var player = PlayerList[Context.PlayerID];
  var mb = player.MonitorBounds;
  mb.Height = mb.Height - 1;
  player.MonitorBounds = mb;

  // Per-instance window sizing, matching Context.Width/Context.Height for this instance.
  Game.StartArguments =
    "-screen-fullscreen 0 -popupwindow -screen-width " + Context.Width +
    " -screen-height " + (Context.Height - 1);

  Context.Log("Game.Play running, PlayerID=" + Context.PlayerID + ", GamepadId=" + Context.GamepadId);

  /*
  if (Context.PlayerID == 0) {
    Context.SetProtoInputMultipleControllers(1, 0, 0, 0);
    Context.Log("Set P1 (PlayerID 0) ProtoController1 = 1");
  } else if (Context.PlayerID == 1) {
    Context.SetProtoInputMultipleControllers(2, 0, 0, 0);
    Context.Log("Set P2 (PlayerID 1) ProtoController1 = 2");
  } else {
    Context.Log("UNEXPECTED PlayerID, not 0 or 1: " + Context.PlayerID);
  }
  */
  Context.SetProtoInputMultipleControllers(Context.PlayerID + 1, 0, 0, 0);
};
