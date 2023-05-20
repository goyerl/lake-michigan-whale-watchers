variable "app" {
  type = string
}

variable "function" {
  type = string
}

variable "iam_role" {
  type = string
}

variable "filename" {
  type = string
}

variable "source_code_hash" {
  type = string
}

variable "apigw_arn" {
  type = string
}

variable "apigw_id" {
  type = string
}

variable "apigw_parent_id" {
  type = string
}

variable "path" {
  type = string
}

variable "http_method" {
  type = string
}

variable "env_vars" {
  type    = map(any)
  default = {}
}

variable "handler" {
  type = string
}