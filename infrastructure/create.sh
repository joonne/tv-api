#!/bin/bash

set -euxo pipefail

function deploy_stack
{
    aws cloudformation deploy --template-file cloudformation.yml --stack-name tv-api --profile tv-api
}

function deploy_app
{
    docker build -t tv-api .
}

[[ "$1" = "deploy-stack" ]] && deploy_stack
[[ "$1" = "docker-login" ]] && eval "$( aws ecr get-login --no-include-email --profile tv-api )"