@echo off
SET BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
SET hostname="http://dms1.localhost"
START "" %BROWSER% --app="%hostname%/sites/dms1/app/v1/gui.html" --disable-web-security --allow-file-access-from-files --kiosk --disable-application-cache
start /min "" run_em.bat
