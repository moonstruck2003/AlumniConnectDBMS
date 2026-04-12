<?php
$serverName = "127.0.0.1";
$connectionOptions = array(
    "Database" => "master",
    "Uid" => "sa",
    "PWD" => "root@123",
    "TrustServerCertificate" => true
);
$conn = sqlsrv_connect($serverName, $connectionOptions);
if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}
$tsql = "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'alumni_dbms') CREATE DATABASE alumni_dbms";
$stmt = sqlsrv_query($conn, $tsql);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}
echo "Database checked/created successfully.";
