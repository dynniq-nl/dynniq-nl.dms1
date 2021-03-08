@echo off
:node
cls
node dms --config="config.json" --loglevel=5
pause
GOTO node
