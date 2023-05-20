module "ui" {
  source      = "./ui"
  bucket_name = local.project
  domain_name = "${local.project}.com"
}


