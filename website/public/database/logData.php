<?php
$con = mysqli_connect('185.211.4.53', 'matt', 'Matthewv5903!', 'mattverg_website_data');
if ($con -> connect_error) {
    die('Connection Failed! ' . $con->connect_error);
}

$data_ip = $_COOKIE['ip'];
$data_continent = $_COOKIE['continent'];
$data_country = $_COOKIE['country'];
$data_region = $_COOKIE['region'];
$data_city = $_COOKIE['city'];
$data_isp = $_COOKIE['isp'];
$date_timestamp = $_COOKIE['timestamp'];

$columns = "IP, Continent, Country, Region, City, Provider, Timestamp";
$row = "'$data_ip', '$data_continent', '$data_country', '$data_region', '$data_city', '$data_isp', '$date_timestamp'";
$sql = "INSERT INTO logs ($columns) VALUES ($row)";

if ($con -> query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $con -> error;
}

$con -> close();

?>