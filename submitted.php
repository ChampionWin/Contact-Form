<?php
if(isset($_POST['submit'])){
  $name=$_POST['name'];
  $email=$_POST['email'];
  $message=$_POST['message'];

  $to='matthewsellschicago@gmail.com';
  $subject='Form Submissian';
  $message="Name: ".$name."\n"."Wrote the following:"."\n\n".$message;
  $headers="From: ".$email;
  if(mail($to, $subject,$message, $headers)) {
    echo"<h1>Sent Successfully! Thank you"." ".$name.", We will contact you shortly</h1>";
  }
  else{
    echo "Something went wrong!";
  }

?>