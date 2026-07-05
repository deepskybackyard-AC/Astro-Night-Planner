Astro Night Planner Local Survey Server 1.0
==========================================

Purpose
-------
This Windows helper provides local HiPS survey folders to Astro Night Planner via a local HTTP address, for example:

  http://127.0.0.1:8765/

A browser app cannot read Windows file paths such as D:\AstroSurveys directly. The helper bridges this gap by serving the selected survey root folder as a local web server with CORS enabled.

Start and control window
------------------------
Double-click:

  ANP-Local-Survey-Server-1.0.exe

A native Windows control window opens. It contains:

  - Open interface / Oberfläche öffnen
  - Start server / Server starten
  - Stop server / Server stoppen
  - Exit / Beenden

Closing the window with X only hides it to the notification area. The program keeps running so Astro Night Planner can continue to use local surveys.

Important: use Exit / Beenden when you want to completely stop the helper. Exit stops the local survey server, closes the internal configuration service and releases the EXE file so it can be replaced or deleted.

Tray icon
---------
The tray icon remains available while the helper is running. Right-click it to open the menu:

  - Open interface / Oberfläche öffnen
  - Start server / Server starten
  - Stop server / Server stoppen
  - Exit / Beenden

The tray/control part is separated from the web-server worker. This keeps the tray menu responsive even if the browser configuration page is closed or a server request becomes slow.

Browser configuration page
--------------------------
The helper opens a local configuration page in your default browser. If the browser does not open automatically, use the button in the Windows control window or open the shown local address manually.

The configuration page lets you set:

  - survey root folder
  - local host address
  - local survey port, usually 8765
  - language German/English
  - Start with Windows
  - Start in background / tray
  - Automatically start local survey server

Background mode and autostart
-----------------------------
When Start with Windows is enabled, the helper is registered for the current Windows user. If Start in background / tray is enabled, Windows starts it with:

  ANP-Local-Survey-Server-1.0.exe --background

The control window stays hidden, but the tray icon remains available.

Console mode
------------
For troubleshooting or text-only operation, run:

  ANP-Local-Survey-Server-1.0.exe --console

Useful commands in console mode:

  start   start the local survey file server
  stop    stop the local survey file server
  open    open the browser configuration page
  status  show current status
  quit    stop and exit

Folder examples
---------------
Choose one shared root folder, for example:

  D:\AstroSurveys

Example structure:

  D:\AstroSurveys\nsns\ohs8\properties
  D:\AstroSurveys\nsns\ohs8\Norder4\...
  D:\AstroSurveys\nsns\halpha8\properties
  D:\AstroSurveys\nsns\oiii8\properties

In Astro Night Planner, enter the base URL:

  http://127.0.0.1:8765/

Then enter relative paths per survey, for example:

  nsns/ohs8/
  nsns/halpha8/
  nsns/oiii8/
  nsns/sii8/
  nsns/hbr8/
  nsns/rgb8/

