<?php
//utf8 support:
header('Content-Type: text/html; charset=utf-8');
?>
<html>
  <head>
    <!-- title -->
    <title>�������� controls 5.3.1:</title>
	<!-- utf8 support: -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- jq CDN (bootsrtrap reqired): -->
	<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc=" crossorigin="anonymous"></script>
    <!-- tether	CDN (bootsrtrap reqired): -->
	<script src="https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js"></script>
    <script src="https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js"></script>
	<!-- bootstrap CDN: -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/js/bootstrap.min.js" integrity="sha384-BLiI7JTZm+JWlgKa0M0kGRpJbF2J8q+qreVrKBC47e3K6BW78kGLrCkeRX6I9RoK" crossorigin="anonymous"></script>
    <!-- favicon: -->
	<link rel="icon" href="favicon.ico?v=2" />
	<!-- external CSS: -->
    <link rel="stylesheet" type="text/css" href="../../_css/global.css">
</head>
 <body>
   <div class="container">
     <div class="starter-template">
	  <!-- header info block start: -------------------------------------------------------------------------------->
		<?php
			include_once("../../header.php");
		?>
       <!-- header info block end: -------------------------------------------------------------------------------->
	
       <div class="jumbotron">
	   
		 <!-- task info block start --------------------------------------------------------------------------------->
    	 <h2 class=""><a href = "../../index.php">������� ��������:</a></h2>
         <hr>
		 <h1 class="">�������� controls 5.3.1</h1>
         <h3 class="">��������� �������� �� ������ �� ������������ �� ������������</h3>
		 <p class="lead lead-top-fix">1. �������� ����� ������ �������� <strong>�#</strong> �� <b>Winforms</b>.</p>
		 <p class="lead lead-top-fix">2. �������� ����� �������� ������������.</p>
		 <p class="lead lead-top-fix">3. ����������� �������� � <b>DEV-VALIDATOR</b>.</p>
		 <p class="lead lead-top-fix">4. �������� ����� �������� ��������.</p>
		 <p class="lead lead-top-fix">5. �������� ������� ���������� � �������� ����� � ����� <b>Release</b>.</p>
         <table style="width:100%" class="table table-striped table-condensed">
			  <caption style="caption-side: top">������������ ��������</caption>
			<thead>
			  <tr>
				<th>Properties</th>
				<th>����������</th>
				<th>��������</th>
				<th>����</th>
			  </tr>
			</thead>
			<tr>
				<td>Solution</td>
				<td>��'� ������</td>
				<td><b>Lesson_1</b></td>
				<td><input type="checkbox" value=""></td>
			</tr>
			<tr>
				<td>Program name</td>
				<td>��'� ��������</td>
				<td><b>program_5.1.3</b></td>
				<td><input type="checkbox" value=""></td>
			</tr>
			<tr>
				<td>Form</td>
				<td>�����</td>
				<td><b>Windows Forms</b></td>
				<td><input type="checkbox" value=""></td>
			  </tr>
			  <tr>
				<td>Size</td>
				<td>����� �����</td>
				<td><b>700</b> x <b>300</b> ������</td>
				<td><input type="checkbox" value=""></td>
			  </tr>
			  
			  <tr>
				<td>BackColor</td>
				<td>���� �����</td>
				<td><b>IndianRed</b></td>
				<td><input type="checkbox" value=""></td>
			  </tr>

			  <tr>
				<td>Text</td>
				<td>��������� �����</td>
				<td><b>�������� 1</td>
				<td><input type="checkbox" value=""></td>
			  </tr>

			   <tr>
				<td>StartPosition</td>
				<td>��������� ������� ����</td>
				<td><b>CenterScreen</b></td>
				<td><input type="checkbox" value=""></td>
			 </tr>

			 <tr>
				<td>Opacity</td>
				<td>���������</td>
				<td><b>50%</b></td>
				<td><input type="checkbox" value=""></td>
			 </tr>
			
			
		</table>

         <div class="row pic-centered">
           <img src="target_form.png" alt="...">
         </div>
				 
         <!-- task info block end ----------------------------------------------------------------------------------->

		<!-- help block start ----------------------------------------------------------------------------------->
			<hr>
				<?php
					include_once("../../help.php");
				?>
			<hr> 
		<!-- help block end ----------------------------------------------------------------------------------->

         <!-- task validation block start --------------------------------------------------------------------------->
         <h2 class=''>��������:</h2>
           <!-- uploader start -->
           <form action="..\..\validator_fe.php" method="post" enctype="multipart/form-data">
             ������ ���� ��������, ��� ��������:
             <label class="btn btn-success btn-browse" for="fileToUpload">
             <input id="fileToUpload" name="fileToUpload" type="file" style="display:none;">
               ������ ����
             </label>
             <input class='btn btn-primary btn-upload' type="submit" value="³�������� ����" name="submit"></input>
			 <!-- uploader end -->
			 <input type="hidden" name="codefile" value="controls5.3.1"> <!-- task id -->
         </form>
		 <!-- task validation block end ------------------------------------------------------------------------------>
		
		</div>
		
      </div>
    </div>
  </body>
</html>
