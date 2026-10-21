@echo off
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
 echo Python introuvable. Installez Python puis relancez.
 pause
 exit /b 1
)
python -m pip install -r requirements.txt
if errorlevel 1 (
 echo Echec de l'installation des dependances.
 pause
 exit /b 1
)
python -m streamlit run app.py
pause
