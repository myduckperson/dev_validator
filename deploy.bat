rem cl parameter - url to open

rem global:
set s_xampp_web_root=c:\xampp\htdocs

call build_web_root.bat

if not exist "%s_xampp_web_root%\validator" mkdir "%s_xampp_web_root%\validator"

rem deploy web root:
xcopy /s/y "web_root\*" "%s_xampp_web_root%\validator\*"
rem xcopy /s/y "web_root\index_main.php" "%s_xampp_web_root%\index.php"

rem start "" http://169.254.50.47/
start "" http://127.0.0.1/validator/tasks/50_Click_01/task.php