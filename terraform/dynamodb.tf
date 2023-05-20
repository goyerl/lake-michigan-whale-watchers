resource "aws_dynamodb_table" "schedule" {
  name           = "${local.project_abbv}-schedule"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "season" # partition key
  range_key      = "date"   # sort key

  attribute {
    name = "season"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }
}

resource "aws_dynamodb_table" "at_bats" {
  name           = "${local.project_abbv}-at-bats"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "gameDate" # partition key
  range_key      = "id"       # sort key

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "gameDate"
    type = "S"
  }

  attribute {
    name = "season"
    type = "S"
  }

  local_secondary_index {
    name            = "username"
    projection_type = "ALL"
    range_key       = "username"
  }

  local_secondary_index {
    name            = "season"
    projection_type = "ALL"
    range_key       = "season"
  }

}