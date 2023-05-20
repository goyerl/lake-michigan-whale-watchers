resource "aws_lambda_function" "func" {
  function_name    = "${var.app}-${var.function}"
  filename         = var.filename
  source_code_hash = var.source_code_hash
  handler          = var.handler
  role             = var.iam_role
  runtime          = "python3.9"
  memory_size      = 128

  environment {
    variables = var.env_vars
  }
  depends_on = [
    aws_cloudwatch_log_group.logs
  ]
}

resource "aws_lambda_permission" "permission" {
  statement_id  = "AllowAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.func.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigw_arn}/*/*/*"
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/lambda/${var.app}-${var.function}"
  retention_in_days = 7
}

output "invoke_arn" {
  value = aws_lambda_function.func.invoke_arn
}

resource "aws_api_gateway_resource" "apigw_resource" {
  rest_api_id = var.apigw_id
  parent_id   = var.apigw_parent_id
  path_part   = var.path
}

output "aws_api_gateway_resource" {
  value = aws_api_gateway_resource.apigw_resource
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = var.apigw_id
  resource_id   = aws_api_gateway_resource.apigw_resource.id
  http_method   = var.http_method
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

output "aws_api_gateway_method" {
  value = aws_api_gateway_method.method
}

resource "aws_api_gateway_method_response" "response" {
  rest_api_id = var.apigw_id
  resource_id = aws_api_gateway_resource.apigw_resource.id
  http_method = var.http_method
  status_code = 200
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_integration" "integration" {
  http_method             = aws_api_gateway_method.method.http_method
  resource_id             = aws_api_gateway_resource.apigw_resource.id
  rest_api_id             = var.apigw_id
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.func.invoke_arn
  integration_http_method = "POST"
}

output "aws_api_gateway_integration" {
  value = aws_api_gateway_integration.integration
}

# CORS
resource "aws_api_gateway_method" "cors" {
  rest_api_id   = var.apigw_id
  resource_id   = aws_api_gateway_resource.apigw_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cors" {
  http_method = aws_api_gateway_method.cors.http_method
  resource_id = aws_api_gateway_resource.apigw_resource.id
  rest_api_id = var.apigw_id
  type        = "MOCK"
  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

resource "aws_api_gateway_method_response" "cors" {
  rest_api_id = var.apigw_id
  resource_id = aws_api_gateway_resource.apigw_resource.id
  http_method = aws_api_gateway_method.cors.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Headers" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "cors" {
  depends_on  = [aws_api_gateway_integration.cors]
  rest_api_id = var.apigw_id
  resource_id = aws_api_gateway_resource.apigw_resource.id
  http_method = aws_api_gateway_method.cors.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'${join(",", local.allowed_headers)}'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS,DELETE,PUT'"
  }
}

locals {
  allowed_headers = [
    "Content-Type",
    "X-Amz-Date",
    "Authorization",
    "X-Api-Key",
    "X-Amz-Security-Token"
  ]
}