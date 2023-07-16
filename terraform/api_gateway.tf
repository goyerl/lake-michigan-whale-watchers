data "aws_iam_policy_document" "api_gw" {
  statement {
    sid       = "AllowAllInvoke"
    actions   = ["execute-api:Invoke"]
    resources = ["execute-api:/*"]
    principals {
      identifiers = ["*"]
      type        = "*"
    }
  }
}

resource "aws_api_gateway_account" "apigw" {
  cloudwatch_role_arn = aws_iam_role.apigw_cw.arn
}

resource "aws_iam_role" "apigw_cw" {
  name = "api_gateway_cloudwatch_global"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "apigw_cw" {
  name = "default"
  role = aws_iam_role.apigw_cw.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_api_gateway_rest_api" "api" {
  name   = local.project
  policy = data.aws_iam_policy_document.api_gw.json
}



resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  triggers = {
    "redeployment" = sha1(jsonencode([
      module.get_user_game_at_bats,
      module.get_schedule,
      module.get_game_details,
      module.get_my_stats,
      module.put_at_bat,
      module.delete_at_bat
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "v1"
}

resource "aws_api_gateway_resource" "at_bats" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "at-bats"
}

resource "aws_api_gateway_resource" "delete" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.at_bats_game.id
  path_part   = "delete"
}

resource "aws_api_gateway_resource" "at_bats_game" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.at_bats.id
  path_part   = "{gameDate}"
}

resource "aws_api_gateway_resource" "stats" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.at_bats.id
  path_part   = "stats"
}