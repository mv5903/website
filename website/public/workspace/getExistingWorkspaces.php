<?php
    $con = mysqli_connect('www.mattvandenberg.com', 'mattverg_matt', 'Matt5903', 'mattverg_website_data');

    // Check connection

    if ($con->connect_error) {

      die("Connection failed: " . $conn->connect_error);

    }

    

    $sql = "SELECT * FROM workspaces";
    $sth = mysqli_query($con, $sql);

    $rows = array();

    while($r = mysqli_fetch_assoc($sth)) {

        $rows[] = $r;

    }

    

    echo json_encode($rows, JSON_PRETTY_PRINT);



    

    $conn->close();

?>