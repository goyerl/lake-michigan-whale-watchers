data "aws_iam_policy_document" "policy" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:DescribeLimits",
      "dynamodb:DescribeReservedCapacity",
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:GetRecords",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    ]
    resources = [
      "*"
    ]
  }
}

data "aws_iam_policy_document" "trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "archive_file" "src" {
  type             = "zip"
  output_path      = "${path.root}/function.zip"
  output_file_mode = "0755"
  source_dir       = "${path.root}/../api"
}

resource "aws_iam_role_policy" "policy" {
  role   = aws_iam_role.role.id
  policy = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role" "role" {
  name               = "${local.project_abbv}-api-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.trust.json
}

module "get_user_game_at_bats" {
  source           = "./function"
  path             = "{username}"
  function         = "get-user-game-at-bats"
  handler          = "get_game_at_bats.handler"
  http_method      = "GET"
  app              = local.project_abbv
  iam_role         = aws_iam_role.role.arn
  filename         = data.archive_file.src.output_path
  source_code_hash = data.archive_file.src.output_base64sha256
  apigw_arn        = aws_api_gateway_rest_api.api.execution_arn
  apigw_id         = aws_api_gateway_rest_api.api.id

  apigw_parent_id = aws_api_gateway_resource.at_bats_game.id

  env_vars = {
    TABLE_NAME = "${local.project_abbv}-at-bats"
  }
}

module "get_schedule" {
  source           = "./function"
  path             = "schedule"
  function         = "get-schedule"
  handler          = "get_schedule.handler"
  http_method      = "GET"
  app              = local.project_abbv
  iam_role         = aws_iam_role.role.arn
  filename         = data.archive_file.src.output_path
  source_code_hash = data.archive_file.src.output_base64sha256
  apigw_arn        = aws_api_gateway_rest_api.api.execution_arn
  apigw_id         = aws_api_gateway_rest_api.api.id

  apigw_parent_id = aws_api_gateway_rest_api.api.root_resource_id

  env_vars = {
    TABLE_NAME = "${local.project_abbv}-schedule"
    SEASON     = local.active_season
  }
}

module "get_game_details" {
  source           = "./function"
  path             = "{date}"
  function         = "get-game-details"
  handler          = "get_game_details.handler"
  http_method      = "GET"
  app              = local.project_abbv
  iam_role         = aws_iam_role.role.arn
  filename         = data.archive_file.src.output_path
  source_code_hash = data.archive_file.src.output_base64sha256
  apigw_arn        = aws_api_gateway_rest_api.api.execution_arn
  apigw_id         = aws_api_gateway_rest_api.api.id

  apigw_parent_id = module.get_schedule.aws_api_gateway_resource.id

  env_vars = {
    TABLE_NAME = "${local.project_abbv}-schedule"
    SEASON     = local.active_season
  }
}

module "get_my_stats" {
  source           = "./function"
  path             = "{username}"
  function         = "get-my-stats"
  handler          = "get_my_stats.handler"
  http_method      = "GET"
  app              = local.project_abbv
  iam_role         = aws_iam_role.role.arn
  filename         = data.archive_file.src.output_path
  source_code_hash = data.archive_file.src.output_base64sha256
  apigw_arn        = aws_api_gateway_rest_api.api.execution_arn
  apigw_id         = aws_api_gateway_rest_api.api.id

  apigw_parent_id = aws_api_gateway_resource.stats.id

  env_vars = {
    TABLE_NAME = "${local.project_abbv}-at-bats"
  }
}

module "put_at_bat" {
  source           = "./function"
  path             = "put"
  function         = "put-at-bat"
  handler          = "put_at_bat.handler"
  http_method      = "PUT"
  app              = local.project_abbv
  iam_role         = aws_iam_role.role.arn
  filename         = data.archive_file.src.output_path
  source_code_hash = data.archive_file.src.output_base64sha256
  apigw_arn        = aws_api_gateway_rest_api.api.execution_arn
  apigw_id         = aws_api_gateway_rest_api.api.id

  apigw_parent_id = aws_api_gateway_resource.at_bats.id

  env_vars = {
    TABLE_NAME = "${local.project_abbv}-at-bats"
  }
}

module "delete_at_bat" {
  source           = "./function"
  path             = "{id}"
  function         = "delete-at-bat"
  handler          = "delete_at_bat.handler"
  http_method      = "POST"
  app              = local.project_abbv
  iam_role         = aws_iam_role.role.arn
  filename         = data.archive_file.src.output_path
  source_code_hash = data.archive_file.src.output_base64sha256
  apigw_arn        = aws_api_gateway_rest_api.api.execution_arn
  apigw_id         = aws_api_gateway_rest_api.api.id

  apigw_parent_id = aws_api_gateway_resource.delete.id

  env_vars = {
    TABLE_NAME = "${local.project_abbv}-at-bats"
  }
}
