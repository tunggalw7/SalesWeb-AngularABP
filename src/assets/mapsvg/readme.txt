Online documentation: http://mapsvg.com/documentation/

Installation
------------
Just put /mapsvg folder with all its contents anywhere on your server.
Then enter http://yoursite.com/path-to/mapsvg/ in your browser to get started.

Modes
------------
MapSVG Builder is able to work in two modes:

1) HTML + JS: in this mode you can't upload files from a browser and you need to edit "settings.js" file
if you want to add custom markers. Also you don't have map selection function because you can't read
contents of /maps folder with javaScript;

2) PHP + HTML + JS: you can upload files and you have map selection function. /maps folder is being
scanned on start to get full list of all available maps.

Mode is being switched automatically: plugin tries to make an AJAX call to "functions.php" file and in
case of success it switches itself to PHP mode.