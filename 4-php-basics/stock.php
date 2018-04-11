<html>
<head>
	<title>Stock Information from Markit On Demand</title>
	<script type="text/javascript">
		function clearForm() {
			document.getElementById("inputName").value = "";
		}

		function validateForm() {
		    var x = document.forms["stockForm"]["inputName"].value;
		    if (x == "") {
		        alert("Please enter Name or Symbol");
		        return false;
		    }
		}
	</script>
	<style>
		body {
			margin-top: 10%;
		}
		.header {
			margin-left: auto;
			margin-right: auto;
		}
		#title {
			font-size: 3em;
			font-style: italic;
			text-align: center;
		}

		.tableStock {
			background-color: #d0d6e0;
			margin-left: auto;
			margin-right: auto;
		}

		h3 {
			color: red; 
			text-align: center;
		}

		p, h2 {
			text-align: center;
		}

		footer {
			width: 100%;
			height: 50px;
			background-color: gray;
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
		}
	</style>
</head>
<body>
	<table class="tableStock" cellspacing="2" border="2">
		<tr><th id="title" colspan="2">Stock Search</th></tr>
		<tr>
		<form action="stock.php" method="post" name="stockForm">
			<td>Company Name or Symbol:</td>
			<td>
				<input style="background-color:#e8e8e8;" type="text" name="inputName" id="inputName" placehlder="Enter text"><br>
			</td>
		</tr>
		<tr>
			<td>
				<input style="background-color:#e8e8e8;text-align:center" type="submit" value="Search" name="search" onclick="return validateForm()
				">
			</td>
			<td>
				<input style="background-color:#e8e8e8;text-align:center" type="submit" value="Clear" name="clear" onclick="clearForm();"><br>
			</td>
		</tr>
		<tr>
			<td colspan="2" style="text-align: center;">
				<a href="http://www.markit.com/product/markit-on-demand">Powered By Markit on Demand</a>
			</td>
		</tr>
		</form>
	</table>
	<br><br>
	<?php
	if (isset($_POST["search"])) {
		$input_name = $_POST["inputName"];
		$lookup_url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=";
		$url = "$lookup_url$input_name";
		$json_file = file_get_contents($url);
		$json_array = json_decode($json_file, true);
		$length = count($json_array);

		if ($length == 0 || $length < 0) {
			echo "<h3>No Records has been found</h3>";
		} else {
			echo "<table class='tableStock' border='1'>";
			echo "<tr><th>Name</th><th>Symbol</th><th>Exchange</th><th>Details</th></tr>";
			foreach ($json_array as $key => $value) {
				echo "<tr>";
				echo "<td>".$value["Name"]."</td>";
				$sym = $value["Symbol"];
				echo "<td>".$sym."</td>";
				echo "<td>".$value["Exchange"]."</td>";
				echo "<td><a href='?symbol=$sym'>More details</a></td>";
				echo "</tr>";
			}
			echo "</table>";
		}
	} elseif (isset($_GET["symbol"])) {
		$quote_api = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=";
		$quote_symbol = $_GET["symbol"];
		$quote_url = "$quote_api$quote_symbol";
		$quote_json_file = file_get_contents($quote_url);
		$quote_array = json_decode($quote_json_file, true);
		// $quote = $quote_array["Name"];
		// print_r($quote_array);

		echo "<table class='tableStock' border='1'>";
		foreach ($quote_array as $key => $value) {
			if ($key == "Status") {
				if ($value == "SUCCESS") {
					continue;	
				} else {
					echo "<h3>There is no stock information available</h3>";
					break;
				}
			} else if ($key == "Name") {
				echo "<tr><th>".$key."</th><td style='text-align:center;'>".$value."</td></tr>";
			} else if ($key == "Symbol") {
				echo "<tr><th>".$key."</th><td style='text-align:center;'>".$value."</td></tr>";
			} else if ($key == "Change") {
				$rounded_val = round($value, 2);
				echo "<tr><th>".$key."</th><td style='text-align:center;'>".$rounded_val;
				echo indicator($rounded_val);
				echo "</td></tr>";
			} else if ($key == "ChangePercent" || $key == "ChangePercentYTD") {
				$rounded_val = round($value, 2);
				echo "<tr><th>Change Percent</th><td style='text-align:center;'>".$rounded_val;
				echo indicator($rounded_val);
				echo "</td></tr>";
			} else if ($key == "Timestamp") {
				date_default_timezone_set('America/Los_Angeles');
				echo "<tr><th>".$key."</th><td style='text-align:center;'>".date("Y-m-d h:i A e", strtotime($value))."</td></tr>";
			} else if ($key == "MarketCap") {
				$billion = 1000000000;
				$formatted = $value/$billion;
				$rounded_val = round($formatted, 2);
				echo "<tr><th>Market Cap</th><td style='text-align:center;'>".$rounded_val." B</td></tr>";
			} else if ($key == "Volume") {
				$rounded_val = number_format($value);
				echo "<tr><th>Market Cap</th><td style='text-align:center;'>".$rounded_val."</td></tr>";
			} else if ($key == "ChangeYTD") {
				$rounded_val = round($value, 2);
				echo "<tr><th>Change YTD</th><td style='text-align:center;'>";
				if ($rounded_val < 0) {
					echo "(".$rounded_val.")";
				} else {
					echo $rounded_val;
				}
				echo indicator($rounded_val);
				echo "</td></tr>";
			} else {
			 	echo "<tr><th>".$key."</th><td style='text-align:center;'>".$value."</td></tr>";
			}
		}
		echo "</table>";
	} 

	function indicator($value) {
		if ($value < 0) {
			return "<img src='./images/red.png' height='10'>";
		} else {
			return "<img src='./images/green.png' height='10'>";
		}
	}
	?>

	<footer>
		<p>&copy Jie Peng Hu - CS174: Spring 2018</p>
	</footer>
</body>
</html>
