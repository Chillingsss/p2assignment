<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

class Data
{
    private function recordExists($recordName)
    {
        include "connection.php";
        $sql = "SELECT COUNT(*) FROM records WHERE record_name = :recordName";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":recordName", $recordName);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function getRecord()
    {
        include "connection.php";
        $sql = "SELECT record_id, record_name, record_description,
                   DATE_FORMAT(record_created_at, '%Y-%m-%d %h:%i %p') as formatted_created_at
            FROM records";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($records);
    }


    public function addRecord($data)
    {
        include "connection.php";
        if ($this->recordExists($data["recordName"])) {
            echo json_encode(["status" => -1, "message" => "Record already exists"]);
            return;
        }

        $sql = "INSERT INTO records (record_name, record_description) VALUES (:recordName, :recordDescription)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":recordName", $data["recordName"]);
        $stmt->bindParam(":recordDescription", $data["recordDescription"]);
        $stmt->execute();
        echo json_encode(["status" => $stmt->rowCount() > 0 ? 1 : 0]);
    }

    public function updateRecord($data)
    {
        include "connection.php";
        try {
            $conn->beginTransaction();

            $stmt = $conn->prepare("UPDATE records SET record_name = :recordName, record_description = :recordDescription WHERE record_id = :recordId");
            $stmt->bindParam(":recordId", $data["recordId"]);
            $stmt->bindParam(":recordName", $data["recordName"]);
            $stmt->bindParam(":recordDescription", $data["recordDescription"]);

            if (!$stmt->execute()) {
                throw new Exception("Failed to update record: " . implode(", ", $stmt->errorInfo()));
            }

            $conn->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $conn->rollBack();
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public function deleteRecord($data)
    {
        include "connection.php";
        try {
            $conn->beginTransaction();

            $stmt = $conn->prepare("DELETE FROM records WHERE record_id = :recordId");
            $stmt->bindParam(":recordId", $data["recordId"]);

            if (!$stmt->execute()) {
                throw new Exception("Failed to delete record: " . implode(", ", $stmt->errorInfo()));
            }

            $conn->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $conn->rollBack();
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}

$data = json_decode(file_get_contents('php://input'), true);
$operation = isset($data["operation"]) ? $data["operation"] : "Invalid";

$dataHandler = new Data();
switch ($operation) {
    case "getRecord":
        $dataHandler->getRecord();
        break;
    case "addRecord":
        $dataHandler->addRecord($data);
        break;
    case "updateRecord":
        $dataHandler->updateRecord($data);
        break;
    case "deleteRecord":
        $dataHandler->deleteRecord($data);
        break;
    default:
        echo json_encode(["status" => -1, "message" => "Invalid operation."]);
}
