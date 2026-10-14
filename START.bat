@echo off
cd /d %~dp0
echo Starting QML Academy at http://localhost:8787 ...
start "" http://localhost:8787
python -m http.server 8787
