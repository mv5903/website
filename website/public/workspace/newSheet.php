<?php
    $target_dir = "csv/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            echo "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            echo "File is not an image.";
            $uploadOk = 0;
        }
    }

    // Check if file already exists
    if (file_exists($target_file)) {
        echo "<p>File you attempted to upload already exists.</p><br>";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        die("Sorry, your file was not uploaded.");
    // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            
        } else {
            die("<p>There was an error uploading your file!</p>");
        }
    }

    $con = mysqli_connect('www.mattvandenberg.com', 'mattverg_matt', 'Matt5903', 'mattverg_website_data');
    if ($con -> connect_error) {
        die('Connection Failed! ' . $con->connect_error);
    }

    $workspaceName = $_POST["workspace-name"];
    $fileName = basename($_FILES["fileToUpload"]["name"]);

    $sql = "INSERT INTO workspaces (name, file) VALUES ('$workspaceName', '$fileName')";

    if ($con -> query($sql) === TRUE) {
        header("Location: https://www.mattvandenberg.com/workspace/edit.html?name=$workspaceName&file=$fileName");
        exit;
    } else {
        echo "Error: " . $sql . "<br>" . $con -> error;
    }

    $con -> close();

?>