<?php 
    $con = new mysqli('www.mattvandenberg.com', 'mattverg_matt', 'Matt5903', 'mattverg_website_data');
    if ($con -> connect_error) {
        die('Connection Failed! ' . $con->connect_error);
    }

    $continents = array();
    $countries = array();
    $regions = array();
    $cities = array();
    $providers = array();
    $ips = array();

    $sql = "SELECT * FROM logs";

    if ($result = mysqli_query($con, $sql)) {
        $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        for ($i = 0; $i < count($rows); $i++) {
            array_push($continents, $rows[$i]['Continent']);
            array_push($countries, $rows[$i]['Country']);
            array_push($regions, $rows[$i]['Region']);
            array_push($cities, $rows[$i]['City']);
            array_push($providers, $rows[$i]['Provider']);
            array_push($ips, $rows[$i]['IP']);
        }
        $continents = json_encode($continents);   
        $countries = json_encode($countries);
        $regions = json_encode($regions);
        $cities = json_encode($cities);
        $providers = json_encode($providers); 
        $ips = json_encode($ips);     
        echo "{ \"continents\": $continents, \"countries\": $countries, \"regions\": $regions, \"cities\": $cities, \"providers\": $providers, \"ips\": $ips }";
    } else {
        echo "Error: " . $sql . $con -> error;
    }

    $con -> close();
?>