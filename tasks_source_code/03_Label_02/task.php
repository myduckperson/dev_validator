<?php
include("../../task_core.php");
$cls_Task = new cls_Task();
//-------------------------------------------------->
//create UI validation webpage:
$cls_Task->s_title = "Класне завдання із написом.";
$cls_Task->s_id = "03_Label_02"; //_exact_ folder name!
$cls_Task->s_description = "Класне завдання із написом.";

//add steps:
//$cls_Task->_add_step("[step-instruction]");
//$cls_Task->_add_step("1. Запустити");
$cls_Task->_add_step("2. Створити");
$cls_Task->_add_step("3. Валідувати");


//add parameters to be validated:
//template:
//$cls_Task->_add_property("Application name", "Ім'я програми", "Form_01.exe");
//$cls_Task->_add_property("TextBox", "Напис в полі", "Привіт");


$cls_Task->s_youtube_url = "[url-yutube]";
$cls_Task->s_discuss_url = "[url-discussion]";
//-------------------------------------------------->
//run:
include("../../t_task.php");
?>